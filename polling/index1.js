'use strict';
// require node modules
const pg = require('pg');
const schedule = require('node-schedule');
// require keys
const postgresURL = process.env.POSTGRES_URL;
// require local modules
const retrieveCompanyNames = require('api/retrieveCompanyNames.js');
const checkCompaniesTable = require('db/checkTables.js').checkCompaniesTable;
const checkLastPollTable = require('db/checkTables.js').checkLastPollTable;

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
        companyNamesPoll.user.companies.forEach(company => {
          // create company name to id obj
          checkCompaniesTable(dbClient, {company_name: company}, done, (company_id) => {
            companiesObj[company] = {company_id: company_id};
            //get last poll date for company
            checkLastPollTable(dbClient, {company_id: company_id}, done, (last_poll) => {
              companiesObj[company]['last_poll'] = last_poll;
            });
          });
          // check if exists in last poll table if doesnt exist poll 21 days and grab last pol date
        });
      });
    }
  });
};
