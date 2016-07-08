'use strict';

/**
 * Refactoring strategy:
 * 1. Make a double join between the calls and participants table:
 * -> Where participant_role = caller
 * -> Where participant_role = callee
 *
 * 2. fetchCalls.js should therefore only have to make one call to the database:
 * -> SELECT (desired returned field) FROM participants p and calls c RIGHT JOIN on
 * c.call_id AND p.call_id WHERE p.contact_id = (x)
 *
 * 3. The join query should also sort by calls.date and set a limit to 50, so that only
 * the most recent 50 calls are fetched.
 *
 * Notes:
 * -> If the join is a RIGHT JOIN, the right-hand column must contain a value per row,
 * whereas rows in the left-hand column (in this case contact_id) may contain NULL.

 * -> Main parameter of fetchCalls should be a JSON object including these properties:
 * @param {integer} first_index - First index of the complete results set.
 * @param {integer} max_calls - Maximum number of calls to be fetched.
 * @param {string} participant_role - Whether the participant is a caller or callee.
 * @param {string} contact_id - Only present for admin role.
 * @param {string} start_date - Date of earliest call in results array.
 * @param {string} end_date - Date of latest call in results array.
 */

// grab all calls for an individual user
const fetchCalls = (dbClient, done, contact_id, company_id, callback) => {
  checkPartipicantsTable(dbClient, done, contact_id, company_id, (result) => {
    restructureCallsResults(dbClient, done, result, (response) => {
      callback(response);
    });
  });
};
// step 1: grabs the rows from the participants table which involve the user and their company.
const checkPartipicantsTable = (dbClient, done, contact_id, company_id, callback) => {
  dbClient.query('SELECT * FROM participants WHERE company_id = $1 AND contact_id = $2',
  [company_id, contact_id], (error, result) => {
    if (error) throw error;
    callback(result.rows);
  });
  done();
};

// step 2: reformats data into response object.
const restructureCallsResults = (dbClient, done, data, callback) => {
  var callList = [];
  data.forEach((callParticipant, i) => {
    var callObj = responseFormatting(callParticipant.call_id, callParticipant.company_id);
    callObj.participants[callParticipant.participant_role.toLowerCase()] = {
      number: callParticipant.number,
      internal: true,
      user: true
    };
    findOtherParticipant(callObj, dbClient, done, (result) => {
      findCallDetails(result, dbClient, done, (response) => {
        callList = callList.concat([response]);
        if (i === data.length - 1) {
          callback(callList);
        }
      });
    });
  });
};

// step 3: structures the data.
const responseFormatting = (call_id, company_id) => {
  return {
    participants: {},
    call_id: call_id,
    company_id: company_id,
    file_id: '',
    duration: '',
    date: ''
  };
};

// step 4: locates caller or callee.
const findOtherParticipant = (callObj, dbClient, done, callback) => {
  const participant = callObj.participants.caller ? 'callee' : 'caller';
  dbClient.query('SELECT number, internal, participant_role FROM participants ' +
    'WHERE company_id = $1 AND call_id = $2 AND participant_role = $3',
    [callObj.company_id, callObj.call_id, participant], (error, result) => {
      if (error) throw error;
      done();
      const response = result.rows;
      const participant_role = response[0].participant_role.toLowerCase();
      callObj.participants[participant_role] = {
        user: false,
        number: response[0].number,
        internal: response[0].internal
      };
      callback(callObj);
    });
};

// step 5: gets call metadata.
const findCallDetails = (callObj, dbClient, done, callback) => {
  dbClient.query('SELECT file_id, duration, EXTRACT(EPOCH FROM date) FROM calls WHERE call_id = $1',
  [callObj.call_id], (error, result) => {
    if (error) throw error;
    done();
    const response = result.rows;
    const date = response[0].date_part;
    callObj.file_id = response[0].file_id;
    callObj.duration = response[0].duration;
    callObj.date = new Date(date * 1000);
    callback(callObj);
  });
};

module.exports = {
  checkPartipicantsTable,
  restructureCallsResults,
  findOtherParticipant,
  findCallDetails,
  fetchCalls
};
