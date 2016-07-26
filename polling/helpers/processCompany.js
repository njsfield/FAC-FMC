const {checkCompaniesTable, checkLastPollTable} = require('../db/checkTables.js');
const calculatePollTimes = require('../api/calculatePollTimes.js');
const waterfall = require('async-waterfall');
const processPollTimes = require('./processPollTimes.js').processPollTimes;

const processCompany = (error, dbClient, done, companyNamesQueue, companiesObj, startPollTime, participantsArray, cb) => {
  const company_name = companyNamesQueue.shift();
  waterfall([
    function (callback) {
      console.log('companyanem ==' , company_name);
        // create company name to id obj
      checkCompaniesTable(dbClient, {company_name: company_name}, done, (company_id) => {
        companiesObj[company_name] = {company_id: company_id};
        callback(null, company_id);
      });
    },
// check the time that the company last polled
    function (company_id, callback) {
      checkLastPollTable(dbClient, {company_id: company_id}, done, (last_poll) => {
        companiesObj[company_name]['last_poll'] = last_poll;
        callback(null, last_poll);
      });
    },
// take the last poll and then calculate which time parameters one needs to poll the pabx
    function (last_poll, callback) {
      console.log(last_poll, startPollTime);
      const pollTimesQueue = calculatePollTimes(startPollTime, last_poll);
      // for each poll time for the company poll for the calls
      console.log(pollTimesQueue, '<<< polltimes');
      processPollTimes(error, dbClient, done, company_name, companiesObj, pollTimesQueue, participantsArray, callback);
        //get last poll date for company
    }
  ],

    function (err, result) {
      console.log(result, '<<<<<');
      if (err) throw err;
      if (companyNamesQueue.length > 0) {
        processCompany(error, dbClient, done, companyNamesQueue, companiesObj, startPollTime, participantsArray, cb);
      }
      else {
        cb(null, dbClient, done);
      }
    });
};

module.exports = {
  processCompany
};
