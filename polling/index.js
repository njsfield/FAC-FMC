require('env2')('config.env');
const pg = require('pg');
const postgresURL = process.env.POSTGRES_URL;
const schedule = require('node-schedule');
const waterfall = require('async-waterfall');

//helpers
const retrieveCompanyNames = require('./api/retrieveCompanyNames.js');
const processCompany = require('./helpers/processCompany.js');

//things we use in function
let companiesObj = {};
let participantsArray = [];

const pollPABX = () => {
  const startPollTime = Date.now();

  waterfall([
    // retrieve company names from PABX in array
    function (callback) {
      retrieveCompanyNames(companyNamesPoll => {
        if (companyNamesPoll.result === 'fail') {
          console.log(companyNamesPoll.message);
        } else {
          pg.connect(postgresURL, (err, dbClient, done) => {
            if (err) throw err;
            const companyNames = companyNamesPoll.user.companies;
            callback(null, err, dbClient, done, companyNames);
          });
        }
      });
    },

    function (err, dbClient, done, companyNames, callback) {
      const companyNamesQueue = ([]).concat(companyNames);
      processCompany(err, dbClient, done, companyNamesQueue, companiesObj, startPollTime, callback);
    }
  ],

  function (err, result) {
    console.log(result, '<<<<<<<Result');
  });
};

pollPABX();
