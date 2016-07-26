const {checkCompaniesTable, checkLastPollTable} = require('../db/checkTables.js');
const calculatePollTimes = require('../api/calculatePollTimes.js');
const waterfall = require('async-waterfall');

const processCompany = (error, dbClient, done, companyNamesQueue, companiesObj, startPollTime, cb) => {

  const company_name = companyNamesQueue.shift();
  waterfall([
    function (callback) {
        // create company name to id obj
      checkCompaniesTable(dbClient, {company_name: company_name}, done, (company_id) => {
        companiesObj[company_name] = {company_id: company_id};
        callback(null, company_id);
      });
    },

    function (company_id, callback) {
      checkLastPollTable(dbClient, {company_id: company_id}, done, (last_poll) => {
        companiesObj[company_name]['last_poll'] = last_poll;
        callback(null, last_poll);
      });
    },

    function (last_poll, callback) {
      const pollTimes = calculatePollTimes(startPollTime, last_poll);
      pollTimes.forEach((timeObj) => {
        console.log(timeObj, 'timeObj<<<<<<<<<<<<<');
      });
      callback(null);
        //get last poll date for company
    }
  ],

    function (err, result) {
      if (companyNamesQueue.length > 0) {
        processCompany(error, dbClient, done, companyNamesQueue, companiesObj, startPollTime, cb);
      }
      else {
        cb(null, 'ended');
      }
    });
};
