const {updateLastPollTable} = require('../db/updateData.js');

module.exports = (dbClient, companyNames, companiesObj, startPollTime, done) => {
  companyNames.forEach((company) => {
    updateLastPollTable(dbClient, {company_id: companiesObj[company].company_id, last_poll: startPollTime}, done, () => {
      // if( index === response.values.length -1 ) {
      console.log('polleneded here');
      // }
    });
  });
};
