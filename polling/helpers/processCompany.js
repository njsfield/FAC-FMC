const {checkCompaniesTable, checkLastPollTable} = require('../db/checkTables.js');
const calculatePollTimes = require('../api/calculatePollTimes.js');
const waterfall = require('async-waterfall');
const processPollTimes = require('./processPollTimes.js').processPollTimes;

const processCompany = (error, dbClient, done, companyNamesQueue, companiesObj, startPollTime, participantsArray, cb) => {
  const company_name = companyNamesQueue.shift();
  waterfall([
    function (callback) {
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
      const pollTimesQueue = calculatePollTimes(startPollTime, last_poll);
      // for each poll time for the company poll for the calls
      processPollTimes(error, dbClient, done, company_name, companiesObj, pollTimesQueue, participantsArray, callback);
        //get last poll date for company
    },

    function (callback) {
      selectMinParticipantsId(dbClient, companiesObj[company_name], done, () => {
        callback(null);
      });
    }
  ],

    function (err, result) {
      if (err) throw err;
      if (companyNamesQueue.length > 0) {
        processCompany(error, dbClient, done, companyNamesQueue, companiesObj, startPollTime, participantsArray, cb);
      }
      else {
        cb(null, dbClient, done);
      }
    });
};

const selectMinParticipantsId = (dbClient, companyObj, done, callback) => {
  const queryArray = [companyObj.company_id, companyObj.last_poll];
  console.log(companyObj.last_poll, '<<<<<<<LAST POLL');
  dbClient.query('select calls.date, participants.participant_id from calls left join participants on calls.call_id=participants.call_id where participants.company_id =$1 and calls.date > (to_timestamp($2) at time zone \'UTC\')', queryArray, (err, res) => {
    if (err) throw err;
    console.log('min participants>>>>>>>', res.rows);
    if (res.rowCount !== 0) {
      callback(res.rows[0]);
    } else {
      callback(null);
    }
    // [0].participant_id
  });
};


module.exports = {
  processCompany
};
