const updateParticipantsTable = (dbClient, participantObj, companiesObj, done, callback) => {
  const queryArray = [true, participantObj.owner, participantObj.company, participantObj.virt_exten];
  // if (companiesObj.minPartyId) {
  //
  // }
  dbClient.query('UPDATE participants SET internal=($1), contact_id=($2) WHERE company_id=(SELECT company_id FROM companies WHERE company_name=$3) AND number=($4)',
  queryArray, (error, response) => {
    if (error) throw error;
    callback(response);
  });
  done();
};

const updateLastPollTable = (dbClient, object, callback) => {
  const queryArray = [object.last_poll];
  dbClient.query('UPDATE last_poll SET last_poll = (TO_TIMESTAMP($1))', queryArray, (error, response) => {
    if (error) throw error;
    callback(response);
  });
};

module.exports = {
  updateParticipantsTable,
  updateLastPollTable
};
