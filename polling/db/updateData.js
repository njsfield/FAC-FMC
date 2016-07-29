'use strict';
const {insertIntoLastPollTable} = require('./insertData.js');
const {checkLastPollTable} = require('./checkTables.js');

const updateParticipantsTable = (dbClient, participantObj, companiesObj, done, callback) => {
  const queryArray = [true, participantObj.owner, participantObj.company, participantObj.virt_exten];
  let queryString = 'UPDATE participants SET internal=($1), contact_id=($2) WHERE company_id=(SELECT company_id FROM companies WHERE company_name=$3) AND number=($4)';
  if (companiesObj[participantObj.company].minPartyId !== undefined) {
    queryString += 'AND participants.participant_id > ' + companiesObj[participantObj.company].minPartyId;
  }
  dbClient.query( queryString, queryArray, (error, response) => {
    if (error) {
      throw(error);
    } else {
      callback(null, response);
    }
    done();
  });
};

const updateLastPollTable = (dbClient, object, done, callback) => {
  checkLastPollTable(dbClient, object, done, (err, res) => {
    const queryArray = [object.last_poll/1000, object.company_id];
    if (res) {
      dbClient.query('UPDATE last_polls SET last_poll = (TO_TIMESTAMP($1) at time zone \'UTC\') where company_id=$2', queryArray, (error, response) => {
        if (error) {
          callback(error);
        } else {
          callback(null, response);
        }
        done();
      });
    } else {
      insertIntoLastPollTable(dbClient, object, done, (err1, response)=>{
        if (err1) {
          callback(err1);
        } else {
          callback(null, response);
        }
        done();
      });
    }

  });
};

module.exports = {
  updateParticipantsTable,
  updateLastPollTable
};
