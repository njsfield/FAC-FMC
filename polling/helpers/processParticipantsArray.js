const retrieveCallerDetails = require('../api/retrieveCallerDetails.js');
const {updateParticipantsTable} = require('../db/updateData.js');

module.exports = (dbClient, done, companiesObj, startPollTime, participantsArray, cb) => {
  retrieveCallerDetails(participantsArray, (err, callerDetails) => {
    if ( callerDetails.rowCount !== 0) {
      processCallerDetails(dbClient, done, companiesObj, startPollTime, callerDetails.values, cb);
    }
  });
};

const processCallerDetails = (dbClient, done, companiesObj, startPollTime, callerDetails, cb) => {
  const thisParticipant = callerDetails.shift();
  if (thisParticipant.company) {
    updateParticipantsTable(dbClient, thisParticipant, companiesObj, done, (err) => {
      if (err) {
        cb(err);
      } else {
        if (callerDetails.length > 0) {
          processCallerDetails(dbClient, done, companiesObj, startPollTime, callerDetails, cb);
        } else {
          cb(null, dbClient, done);
        }
      }
    });
  } else {
    if (callerDetails.length > 0) {
      processCallerDetails(dbClient, done, companiesObj, startPollTime, callerDetails, cb);
    } else {
      cb(null, dbClient, done);
    }
  }
};
