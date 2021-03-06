const {updateLastPollTable} = require('../db/updateData.js');

const updatePollTable = (dbClient, done, companyNames, companiesObj, startPollTime, cb) => {
  const thisCompany = companyNames.shift();
  updateLastPollTable(dbClient, {company_id: companiesObj[thisCompany].company_id, last_poll: startPollTime}, done, (err, res) => {
    if (companyNames.length > 0) {
      updatePollTable(dbClient, done, companyNames, companiesObj, startPollTime, cb);
    }
    else {
      cb(null, res);
    }
  });
};

module.exports = {
  updatePollTable
};
