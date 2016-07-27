const waterfall = require('async-waterfall');

const retrieveCompanyCalls = require('../api/retrieveCompanyCalls.js');
const {processCalls} = require('./processCalls.js');

const processPollTimes = (error, dbClient, done, company_name, companiesObj, pollTimesQueue, participantsArray, cb) => {
  const thisPoll = pollTimesQueue.shift();
  waterfall([
    function(callback) {
      retrieveCompanyCalls(company_name, thisPoll, (arrOfCalls) => {
        callback(null, arrOfCalls);
      });
    },

    function(arrOfCalls, callback){
      if (arrOfCalls.result !== 'fail') {
        processCalls( dbClient, done, company_name, companiesObj, arrOfCalls, participantsArray, callback);
      } else {
        console.log(company_name, 'error:', arrOfCalls.message);
        callback(null, arrOfCalls.message);
      }
    }
  ],
function(err, result) {
  if(pollTimesQueue.length > 0) {
    processPollTimes(error, dbClient, done, company_name, companiesObj, pollTimesQueue, participantsArray, cb);
  } else {
    cb(null);
  }
});

};
module.exports = {
  processPollTimes
};
