require('env2')('config.env');
const pg = require('pg');
const postgresURL = process.env.POSTGRES_URL;
const schedule = require('node-schedule');
const waterfall = require('async-waterfall');
const transcribe = require('@ipcortex/meta-transcribe');

//helpers
const retrieveCompanyNames = require('./api/retrieveCompanyNames.js');
const {processCompany} = require('./helpers/processCompany.js');
const processParticipantsArray = require('./helpers/processParticipantsArray.js');
const {updatePollTable} = require('./helpers/updatePollTable.js');

//variables we use in function
let companiesObj = {}; // holds all the company anmes
let participantsArray = [];// a list of participants to later send off to the pollPABX

const pollPABX = (transcribe) => {
  const startPollTime = Date.now();

  waterfall([
    // retrieve company names from PABX in array
    function (callback) {
      retrieveCompanyNames(companyNamesPoll => {
        if (companyNamesPoll.result === 'fail') {
          console.log(companyNamesPoll.message);
        } else {
          pg.connect(postgresURL, (err, dbClient, done) => {
            if (err) {
              callback(err);
            } else {
              const companyNames = companyNamesPoll.user.companies;
              callback(null, dbClient, done, companyNames);
            }
          });
        }
      });
    },
    // for each company poll for calls and store the details in calls, files and participants tables and adds to the partcipantsArray
    function ( dbClient, done, companyNames, callback) {
      processCompany( dbClient, done, companyNames, companiesObj, startPollTime, participantsArray, transcribe, callback);
    },
    // check caller details from participants array to update participants table
    function(dbClient, done, callback) {
      if (participantsArray.length > 0) {
        processParticipantsArray(dbClient, done, companiesObj, startPollTime, participantsArray, callback);
      } else {
        callback(null, dbClient, done);
      }
    },

    function(dbClient, done, callback) {
      updatePollTable(dbClient, done, Object.keys(companiesObj), companiesObj, startPollTime, callback);
    }
  ],

  function (err) {
    if(err) console.log( err);
    pg.end();
  });
};

var transcribe = new Transcribe(process.env);
pollPABX(transcribe);
