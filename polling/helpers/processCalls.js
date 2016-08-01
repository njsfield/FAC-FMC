// node modules
const waterfall = require('async-waterfall');
const fs = require('fs');
// function modules
const {checkFilesTable, checkCallsTable, checkParticipantsTable} = require('../db/checkTables.js');
const retrieveWav = require('../api/retrieveWavFiles.js');

const processCalls = (dbClient, done, company_name, companiesObj, arrOfCalls, participantsArray, cb) => {
  const thisCall = arrOfCalls.shift();
  waterfall([
    function (callback) {
      dbClient.query('begin', (err) => {
        if (err) {
          callback(err);
          done(err);
        } else {
          callback(null);
          done();
        }
      });
    },
    function(callback) {
      thisCall.company_id = companiesObj[company_name].company_id;
      checkFilesTable(dbClient, thisCall, done, (err, file_id, command) => {
        thisCall.file_id = file_id;
        if ( command === 'INSERT') {
          retrieveWav(thisCall.file_name, (err1, data) => {
            if (err1) {
              callback(err1);
            } else {
              fs.writeFileSync(process.env.SAVE_AUDIO_PATH + `${file_id}.wav`, data);
              callback(null);
            }
          });
        } else {
          callback(null);
        }
      });
    },
    function(callback){
      checkCallsTable(dbClient, thisCall, done, (err, call_id) => {
        if (err) {
          callback(err);
        } else {
          thisCall.call_id = call_id;
          callback(null);
        }
      });
    },
    function(callback) {
      const callerQueryObj = createCallParticipantObj(thisCall, 'caller');
      checkParticipantsTable(dbClient, callerQueryObj, done, (err, result) => {
        if (err) {
          callback(err);
        } else {
          if(result) checkParticipantsArray(result, participantsArray);
          callback(null);
        }
      });
    },
    function (callback) {
      const calleeQueryObj= createCallParticipantObj(thisCall, 'callee');
      checkParticipantsTable(dbClient, calleeQueryObj, done, (err, result) => {
        if (err) {
          callback(err);
        } else {
          if(result ) checkParticipantsArray(result, participantsArray);
          callback(null);
        }
      });
    },
    function (callback) {
      dbClient.query('commit', (err) => {
        if (err) {
          callback(err);
          done();
        } else {
          callback(null);
          done();
        }
      });
    }
  ],
function(err) {
  if (err) {
    dbClient.query('rollback', (err1) => {
      done(err1);
    });
  } else if (arrOfCalls.length > 0) {
    processCalls(dbClient, done, company_name, companiesObj, arrOfCalls, participantsArray, cb);
  } else {
    cb(null, 'success');
  }
});
};

const checkParticipantsArray = (callParticipant, participantsArray) => {
  // Extension numbers are at least 3 digits but can be longer.
  if (callParticipant.match(/^[a-zA-Z0-9_]*$/)
    && callParticipant.length >= 3
    && callParticipant.length <= 7
    && callParticipant[0] !== 0
  ) {
    if (participantsArray.indexOf(callParticipant) < 0 ) participantsArray.push(callParticipant);
  }

//If a number contains a non-digit then it must be an extension as '_' and alpha are not valid external digits. This covers private extensions nicely.
};
const createCallParticipantObj = (obj, type) => {
  return {
    call_id: obj.call_id,
    company_id: obj.company_id,
    number: obj[type],
    internal: false,
    participant_role: type,
    contact_id: null
  };
};

module.exports = {
  processCalls
};
