require('env2')('config.env');
const pg = require('pg');
const postgresURL = process.env.POSTGRES_URL;
const schedule = require('node-schedule');
const waterfall = require('async-waterfall');

//helpers
const retrieveCompanyNames = require('./api/retrieveCompanyNames.js');
const {processCompany} = require('./helpers/processCompany.js');
const processParticipantsArray = require('./helpers/processParticipantsArray.js');

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
    // for each company poll for calls and store the details in calls, files and participants tables and adds to the partcipantsArray
    function (err, dbClient, done, companyNames, callback) {
      const companyNamesQueue = ([]).concat(companyNames);
      processCompany(err, dbClient, done, companyNamesQueue, companiesObj, startPollTime, participantsArray, callback);
    },
    // check caller details from participants array to update participants table
    function(dbClient, done, callback) {
      console.log(participantsArray);
      processParticipantsArray(dbClient, done, companiesObj, startPollTime, participantsArray, callback);
    }

  ],

  function (err, result) {
  });
};

pollPABX();
