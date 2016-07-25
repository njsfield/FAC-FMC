'use strict';
// require node modules
require('env2')('config.env');
const pg = require('pg');
const fs = require('fs');
const schedule = require('node-schedule');
// require keys
const postgresURL = process.env.POSTGRES_URL;
// require local modules
const {checkFilesTable, checkCompaniesTable, checkCallsTable, checkLastPollTable} = require('./db/checkTables.js');
const {insertIntoParticipantsTable} = require('./db/insertData.js');
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
        companyNamesPoll.user.companies.forEach(company_name => {
          // create company name to id obj
          checkCompaniesTable(dbClient, {company_name: company_name}, done, (company_id) => {
            companiesObj[company_name] = {company_id: company_id};
            //get last poll date for company
            checkLastPollTable(dbClient, {company_id: company_id}, done, (last_poll) => {
              companiesObj[company_name]['last_poll'] = last_poll;
              calculatePollTimes(startPollTime, last_poll).forEach( (timeObj) => {
                retrieveCompanyCalls(company_name, timeObj, (arrOfCalls) => {
                  if (arrOfCalls.result !== 'fail') {
                    arrOfCalls.forEach(call => {
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
                          insertIntoParticipantsTable(dbClient, callerQueryObj, done, () => {
                          });
                          const calleeQueryObj= createCallParticipantObj(call, 'callee');
                          insertIntoParticipantsTable(dbClient, calleeQueryObj, done, () => {
                          });
                          checkParticipantsArray([calleeQueryObj, callerQueryObj]);

                        });
                      });
                    });
                  }
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

// pollPABX helpers
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

const checkParticipantsArray = (callParticipants) => {
  callParticipants.forEach ( (participant) => {
    if (participantsArray.indexOf(participant) < 0 ) participantsArray.push(participant);
  });
};
