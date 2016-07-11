const storeCompanyCalls = require('./storeCompanyCalls.js').storeCompanyCalls;
const pollingCompanies = require('./api/pollingCompanies.js').pollingCompanies;
const pg = require('pg');
const postgresURL = process.env.POSTGRES_URL;

pollingCompanies(res => {
  if(res.result !== 'fail') {
    pg.connect(postgresURL, (err, dbClient, done) => {
      if (err) throw err;
      res.user.companies.forEach((company) => {
        storeCompanyCalls(dbClient, done, company);
      });
    });
  }
});
