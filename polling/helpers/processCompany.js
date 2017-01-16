const {checkCompaniesTable, checkLastPollTable} = require('../db/checkTables.js');
const calculatePollTimes = require('../api/calculatePollTimes.js');
const waterfall = require('async-waterfall');
const processPollTimes = require('./processPollTimes.js').processPollTimes;

const processCompany = (dbClient, done, companyNamesQueue, companiesObj, startPollTime, participantsArray, transcribe, cb) => {
  const company_name = companyNamesQueue.shift();
  waterfall([
    function (callback) {
        // create company name to id obj
      checkCompaniesTable(dbClient, {company_name: company_name}, done, (err, company_id) => {
        if (err) {
          callback(err);
        } else {
          companiesObj[company_name] = {company_id: company_id};
          callback(null, company_id);
        }
      });
    },
// check the time that the company last polled
    function (company_id, callback) {
      checkLastPollTable(dbClient, {company_id: company_id}, done, (err, last_poll) => {
        if (err) {
          callback(err);
        } else {
          companiesObj[company_name]['last_poll'] = last_poll;
          callback(null, last_poll);
        }
      });
    },
// take the last poll and then calculate which time parameters one needs to poll the pabx
    function (last_poll, callback) {
      const pollTimesQueue = calculatePollTimes(startPollTime, last_poll);
      // for each poll time for the company poll for the calls
      processPollTimes(dbClient, done, company_name, companiesObj, pollTimesQueue, participantsArray, transcribe, callback);
    },

    function (callback) {
      selectMinParticipantsId(dbClient, companiesObj[company_name], done, callback);
    }
  ],
    function (err) {
      if (err) {
        cb(err);
      } else if (companyNamesQueue.length > 0) {
        processCompany(dbClient, done, companyNamesQueue, companiesObj, startPollTime, participantsArray, cb);
      }
      else {
        cb(null, dbClient, done);
      }
    });
};

const selectMinParticipantsId = (dbClient, companyObj, done, callback) => {
  let string = '';
  let queryArray = [companyObj.company_id];
  if (companyObj.last_poll !== undefined) {
    queryArray.push(companyObj.last_poll);
    string = 'and calls.date > (to_timestamp($2) at time zone \'UTC\')';
  }
  const queryString = 'select calls.date, participants.participant_id from calls left join participants on calls.call_id=participants.call_id where participants.company_id =$1 ' + string;
  dbClient.query(queryString, queryArray, (err, res) => {
    if (err) {
      callback('selectMinParticipantsId: '+err);
    } else if (res.rowCount !== 0) {
      companyObj.minPartyId = res.rows[0].participant_id;
      callback();
    } else {
      callback();
    }
  });
};

module.exports = {
  processCompany
};
