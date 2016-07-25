'use strict';
// require node modules
require('env2')('config.env');
const pg = require('pg');
const fs = require('fs');
const schedule = require('node-schedule');
// require keys
const postgresURL = process.env.POSTGRES_URL;
// require local modules

const retrieveCompanyNames = require('./api/retrieveCompanyNames.js');
const retrieveCompanyCalls = require('./api/retrieveCompanyCalls.js');
const checkCompaniesTable = require('./db/checkTables.js').checkCompaniesTable;
const checkLastPollTable = require('./db/checkTables.js').checkLastPollTable;
const calculatePollTimes = require('./api/calculatePollTimes.js');
const checkFilesTable = require('./db/checkTables.js').checkFilesTable;
const retrieveWav = require('./api/retrieveWavFiles.js');
const checkCallsTable = require('./db/checkTables.js').checkCallsTable;

const pollPABX= () => {
  //
  const startPollTime = Date.now();
  let particpantsArray = [];
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
                          console.log(call_id, '<<<<CALL ID INDEX1');
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
