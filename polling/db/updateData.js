const updateParticipantsTable = (dbClient, obj, callback) => {
  const queryArray = [true, obj.owner, obj.company, obj.virt_exten];
  dbClient.query('UPDATE participants SET internal=($1), contact_id=($2) WHERE company_id=(SELECT company_id FROM companies WHERE company_name=$3) AND number=($4)',
  queryArray, (error, response) => {
    if (error) throw error;
    callback(response);
  });
};

module.exports = {
  updateParticipantsTable
};
