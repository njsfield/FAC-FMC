const waterfall = require('async-waterfall');
const fs = require('fs');

const {checkFilesTable, checkCallsTable, checkParticipantsTable} = require('../db/checkTables.js');
const retrieveWav = require('../api/retrieveWavFiles.js');

const processCalls = (dbClient, done, company_name, companiesObj, arrOfCalls, participantsArray, cb) => {
  const thisCall = arrOfCalls.shift();
  waterfall([
    function (callback) {
      dbClient.query('begin', (err, res) => {
        if (err) throw err;
        done();
        callback(null);
      });
    },
    function(callback) {
      thisCall.company_id = companiesObj[company_name].company_id;
      checkFilesTable(dbClient, thisCall, done, (file_id, command) => {
        thisCall.file_id = file_id;
        if ( command === 'INSERT') {
          retrieveWav(thisCall.file_name, (data) => {
            fs.writeFileSync(process.env.SAVE_AUDIO_PATH + `${file_id}.wav`, data);
            callback(null);
          });
        } else {
          callback(null);
        }
      });
    },
    function(callback){
      checkCallsTable(dbClient, thisCall, done, (call_id) => {
        thisCall.call_id = call_id;
        callback(null);

      });
    },
    function(callback) {
      const callerQueryObj = createCallParticipantObj(thisCall, 'caller');
      checkParticipantsTable(dbClient, callerQueryObj, done, (result) => {
        if(result) checkParticipantsArray(result, participantsArray);
        callback(null);
      });

    },
    function (callback) {
      const calleeQueryObj= createCallParticipantObj(thisCall, 'callee');
      checkParticipantsTable(dbClient, calleeQueryObj, done, (result) => {
        if(result ) checkParticipantsArray(result, participantsArray);
        callback(null);
      });
    },

    function (callback) {
      dbClient.query('commit', (err, res) => {
        if (err) {

        }
        done();
        callback(null);
      });
    }
  ],
function(err) {
  if (err) throw err;
  if (arrOfCalls.length > 0) {
    processCalls(dbClient, done, company_name, companiesObj, arrOfCalls, participantsArray, cb);
  } else {
    cb(null, 'success');
  }
});
};

const checkParticipantsArray = (callParticipant, participantsArray) => {
  if (participantsArray.indexOf(callParticipant) < 0 ) participantsArray.push(callParticipant);
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
