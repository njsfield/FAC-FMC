'use strict';
const {insertIntoLastPollTable} = require('./insertData.js');
const {checkLastPollTable} = require('./checkTables.js');
const updateParticipantsTable = (dbClient, participantObj, companyObj, done, callback) => {
  const queryArray = [true, participantObj.owner, participantObj.company, participantObj.virt_exten];
  let string = '';
  if (companyObj.minPartyId) {
    string = 'AND participants.participant_id > ' + companyObj.minPartyId;
  }
  dbClient.query('UPDATE participants SET internal=($1), contact_id=($2) WHERE company_id=(SELECT company_id FROM companies WHERE company_name=$3) AND number=($4)' + string,
  queryArray, (error, response) => {
    if (error) throw error;
    done();
    callback(response);
  });
};

const updateLastPollTable = (dbClient, object, done, callback) => {
  checkLastPollTable(dbClient, object, done, (res) => {
    if (res) {
      dbClient.query('UPDATE last_poll SET last_poll = (TO_TIMESTAMP($1)) where company_id=$2', queryArray, (error, response) => {
        if (error) throw error;

        done();
        callback();
      });
    } else {
      insertIntoLastPollTable(dbClient, object, done, ()=>{
        callback();

      });
    }

  });
  const queryArray = [object.last_poll, object.company_id];
};

module.exports = {
  updateParticipantsTable,
  updateLastPollTable
};
