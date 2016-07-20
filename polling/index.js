const pg = require('pg');
const schedule = require('node-schedule');
const storeCompanyCalls = require('./storeCompanyCalls.js').storeCompanyCalls;
const retrieveCompanyNames = require('./api/retrieveCompanyNames.js').retrieveCompanyNames;
const checkCompaniesTable = require('./db/checkTables.js').checkCompaniesTable;
const postgresURL = process.env.POSTGRES_URL;

schedule.scheduleJob('* */12 * * *', () => {
  retrieveCompanyNames(res => {
    if(res.result !== 'fail') {
      pg.connect(postgresURL, (err, dbClient, done) => {
        if (err) throw err;
        res.user.companies.forEach((company) => {
          checkCompaniesTable(dbClient, {company_name: company}, () => {
            storeCompanyCalls(dbClient, done, company);
          });
        });
      });
    } else {
      console.log(res.message);
    }
  });
});
