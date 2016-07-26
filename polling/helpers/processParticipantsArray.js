const retrieveCallerDetails = require('../api/retrieveCallerDetails.js');
const {updateParticipantsTable} = require('../db/updateData.js');

module.exports = (dbClient, done, companiesObj, startPollTime, participantsArray, cb) => {
  console.log(participantsArray);
  retrieveCallerDetails(participantsArray, (callerDetails) => {
    console.log(callerDetails);
    if ( callerDetails.rowCount !== 0) {
      processCallerDetails(dbClient, done, companiesObj, startPollTime, callerDetails.values, cb);
    }
  });
};

const processCallerDetails = (dbClient, done, companiesObj, startPollTime, callerDetails, cb) => {
  const thisParticipant = callerDetails.shift();
  updateParticipantsTable(dbClient, thisParticipant, companiesObj, done, () => {
    if (callerDetails.length > 0) {
      processCallerDetails(dbClient, done, companiesObj, startPollTime, callerDetails, cb);
    } else {
      cb(null, 'callerdetails processed');
    }
  });
};
