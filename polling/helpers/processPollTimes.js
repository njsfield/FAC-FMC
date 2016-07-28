const waterfall = require('async-waterfall');

const retrieveCompanyCalls = require('../api/retrieveCompanyCalls.js');
const {processCalls} = require('./processCalls.js');

const processPollTimes = (dbClient, done, company_name, companiesObj, pollTimesQueue, participantsArray, cb) => {
  const thisPoll = pollTimesQueue.shift();
  waterfall([
    function(callback) {
      retrieveCompanyCalls(company_name, thisPoll, (err, arrOfCalls) => {
        if (err) {
          callback(err);
        } else {
          callback(null, arrOfCalls);
        }
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
function(err) {
  if (err) {
    cb(true);
  } else if (pollTimesQueue.length > 0) {
    processPollTimes(dbClient, done, company_name, companiesObj, pollTimesQueue, participantsArray, cb);
  } else {
    cb(null);
  }
});

};
module.exports = {
  processPollTimes
};
