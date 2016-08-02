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
      if (arrOfCalls.result !== 'fail' && arrOfCalls.length > 0) {
        processCalls( dbClient, done, company_name, companiesObj, arrOfCalls, participantsArray, callback);
      } else {
        const message = arrOfCalls.message ? arrOfCalls.message : 'no calls available';
        console.log('fetching calls for ', company_name, 'has errored:', message);
        callback(null);
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
