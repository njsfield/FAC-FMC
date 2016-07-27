require('env2')('config.env');
const pg = require('pg');
const postgresURL = process.env.POSTGRES_URL;
const schedule = require('node-schedule');
const waterfall = require('async-waterfall');

//helpers
const retrieveCompanyNames = require('./api/retrieveCompanyNames.js');
const {processCompany} = require('./helpers/processCompany.js');
const processParticipantsArray = require('./helpers/processParticipantsArray.js');
const {updatePollTable} = require('./helpers/updatePollTable.js');

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
      processCompany(err, dbClient, done, companyNames, companiesObj, startPollTime, participantsArray, callback);
    },
    // check caller details from participants array to update participants table
    function(dbClient, done, callback) {
      processParticipantsArray(dbClient, done, companiesObj, startPollTime, participantsArray, callback);
    },

    function(dbClient, done, callback) {
      updatePollTable(dbClient, done, Object.keys(companiesObj), companiesObj, startPollTime, callback);
    },

    function() {
      pg.end();
    }

  ],

  function (err, result) {
  });
};

pollPABX();
