'use strict';
// require node modules
require('env2')('config.env');
const pg = require('pg');
const fs = require('fs');
const schedule = require('node-schedule');
// require keys
const postgresURL = process.env.POSTGRES_URL;
// require local modules
const {checkFilesTable, checkCompaniesTable, checkCallsTable, checkParticipantsTable, checkLastPollTable} = require('./db/checkTables.js');
const updateParticipantsTable = require('./db/updateData.js').updateParticipantsTable;
const retrieveCallerDetails = require('./api/retrieveCallerDetails.js');
const {insertIntoParticipantsTable} = require('./db/insertData.js');
const updateLastPollTable = require('./db/updateData.js').updateLastPollTable;
const retrieveCompanyNames = require('./api/retrieveCompanyNames.js');
const retrieveCompanyCalls = require('./api/retrieveCompanyCalls.js');
const calculatePollTimes = require('./api/calculatePollTimes.js');
const retrieveWav = require('./api/retrieveWavFiles.js');

// upper scope objects
let participantsArray = [];

const pollPABX= () => {
  //
  const startPollTime = Date.now();
  let companiesObj = {};
  // get the names of companies that we have to poll for
  retrieveCompanyNames(companyNamesPoll => {
    if (companyNamesPoll.result === 'fail') {
      console.log(companyNamesPoll.message);
    } else {
      pg.connect(postgresURL, (err, dbClient, done) => {
        if (err) throw err;
        const companyNames = companyNamesPoll.user.companies;
        companyNames.forEach((company_name, companyIndex) => {
          // create company name to id obj
          checkCompaniesTable(dbClient, {company_name: company_name}, done, (company_id) => {
            companiesObj[company_name] = {company_id: company_id};
            //get last poll date for company
            checkLastPollTable(dbClient, {company_id: company_id}, done, (last_poll) => {
              companiesObj[company_name]['last_poll'] = last_poll;
              const pollTimes = calculatePollTimes(startPollTime, last_poll);
              pollTimes.forEach((timeObj, pollTimeIndex) => {
                retrieveCompanyCalls(company_name, timeObj, (arrOfCalls) => {

                  if (arrOfCalls.result !== 'fail') {
                    arrOfCalls.forEach((call, callIndex) => {
                      call.company_id = company_id;
                      checkFilesTable(dbClient, call, done, (file_id, command) => {
                        call.file_id = file_id;

                        if (command === 'INSERT') {
                          // retrieve wav files
                          retrieveWav(call.file_name, (data) => {
                            fs.writeFileSync(process.env.SAVE_AUDIO_PATH + `${file_id}.wav`, data);
                          });
                        }
                        checkCallsTable(dbClient, call, done, (call_id) => {
                          call.call_id = call_id;
                          const callerQueryObj = createCallParticipantObj(call, 'caller');
                          const calleeQueryObj= createCallParticipantObj(call, 'callee');
                          checkParticipantsTable(dbClient, callerQueryObj, done, (result) => {
                            if(result ) checkParticipantsArray(result);
                          });
                          checkParticipantsTable(dbClient, calleeQueryObj, done, (result) => {
                            if(result ) checkParticipantsArray(result);
                          });

                          if(companyIndex === companyNames.length -1 && pollTimeIndex === pollTimes.length -1 && callIndex === arrOfCalls.length -1 ) {
                            retrieveCallerDetails(participantsArray, (response) => {
                              response.values.forEach( (participant, index) => {
                                updateParticipantsTable(dbClient, participant, companiesObj[company_name], done, () => {
                                  companyNames.forEach((company) => {
                                    updateLastPollTable(dbClient, {company_id: companiesObj[company].company_id, last_poll: startPollTime}, () => {
                                      if( index === response.values.length -1 ) {
                                        console.log('polleneded here');
                                      }
                                    });
                                  });
                                });
                              });
                            });
                          }
                        });
                      });
                    });
                  } else {
                    if (companyIndex === companyNames.length -1) {
                      setTimeout(function() {retrieveCallerDetails(participantsArray, (response) => {
                        response.values.forEach( (participant, index) => {
                          updateParticipantsTable(dbClient, participant, companiesObj[company_name], done, () => {
                            companyNames.forEach((company, index2) => {
                              if( index === response.values.length -1 && index2 === companyNames.length -1 ) {
                                updateLastPollTable(dbClient, {company_id: companiesObj[company].company_id, last_poll: startPollTime}, done, () => {
                                  console.log('pollends');
                                  pg.end();
                                });
                              }
                            });
                          });
                        })
                        ;
                      });
                      }, 5000);
                    }
                  }
                  setTimeout( () => {
                    selectMinParticipantsId(dbClient, companiesObj[company_name], done, (minParticipantId) => {
                      console.log(minParticipantId);
                      companiesObj[company_name].minParticipantId = minParticipantId;
                    }, 1000);
                  });
                });
              });
            });
          });
          // check if exists in last poll table if doesnt exist poll 21 days and grab last pol date
        });
      });
    }
  });
};
pollPABX();

const selectMinParticipantsId = (dbClient, companyObj, done, callback) => {
  const queryArray = [companyObj.company_id, companyObj.last_poll];
  dbClient.query('select calls.date, participants.participant_id from calls left join participants on calls.call_id=participants.call_id where participants.company_id =$1 and calls.date > $2', queryArray, (err, res) => {
    if (err) throw err;
    console.log('min participants>>>>>>>', res);
    if (res.rowCount !== 0) {
      callback(res.rows[0]);
    } else {
      callback(null);
    }
    // [0].participant_id
  });
};

// pollPABX helpers
const checkParticipantsArray = (callParticipant) => {
  if (participantsArray.indexOf(callParticipant) < 0 ) participantsArray.push(callParticipant);
};
const createCallParticipantObj = (obj, type) => {
  return {
    call_id: obj.call_id,
    company_id: obj.company_id,
    number: obj[type],
    internal: false,
    participant_role: type,
    contact_id: null
  };
};

module.exports = {
  participantsArray
};
