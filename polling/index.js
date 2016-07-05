'use strict';

const pollCalls = require('./api/polling_calls_api.js');
// const insertData = require('./dbFunctions/insertData.js');
const pollerFlow = require('./dbFunctions/pollerFlow.js').pollerFlow;
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc';
const pg = require('pg');
const companyName = 'default';

/**
 * API calls are made to IPC to update the participants table on a regular basis.
 * Scheduling is still to be implemented.
 *
 * @param {string} company_name - The name of the company to which the calls are attributed.
 * @param {object} file - Properties are caller, callee, duration, company_name, date, file_name,
 * company_id, file_id and call_id.
 * @param {object} user - Properties are user_role, user_name and company_id.
 * @param {object} caller - Properties are call_id, company_id, number, internal, participant_role, user_id.
 * @param {object} callee - Properties are call_id, company_id, number, internal, participant_role, user_id.
 *
 * Refactoring strategy: into 3 loops
 * Loop 1:
 * For each company, fetch a list of files.
 *
 * Loop 2:
 * For each file, call functions that will...
 * a) create a call recording
 * b) create a callee participant
 * c) create a caller participant
 *
 * If the caller matches the extension number, add to -> participants[].
 *
 * Loop 3:
 * If participants.length > 0
 * Update the participants table -> polling_calls_api/retrieveCallerDetails(participants)
 *
 * Additional features:
 * 1. - Create a function that selects the highest index of the participants table and sets
 *      it to a variable.
 *    - If contact_id doesn't exist in Loop 3, where participant_id > max,
 *      company_id = x and number = y internal should be set to 'true'.
 *
 * 2. Introduce try / catch for errors that respond to errors in different ways. e.g.
 *    logging the error if related to the database.
 *
 * 3. Use push instead of concat to avoid clogging memory space.
 */

pollCalls.pollForFileInfo(companyName, (fileObjs) => {
  let participantsArray = [];
  pg.connect(postgresURL, (err, dbClient, done) => {
    if (err) throw err;
    fileObjs.forEach((obj, i) => {
      pollerFlow(dbClient, done, obj, (result) => {
        if(result.command === 'INSERT') {
          const callerQueryArray = [obj.call_id, obj.company_id, obj.caller, false, 'caller'];
          dbClient.query('INSERT INTO participants (call_id, company_id, number, internal, participant_role)' +
          'VALUES ($1, $2, $3, $4, $5)', callerQueryArray, (error) => {
            if (error) throw error;
          });
          const calleeQueryArray = [obj.call_id, obj.company_id, obj.callee, false, 'callee'];
          dbClient.query('INSERT INTO participants (call_id, company_id, number, internal, participant_role)' +
          'VALUES ($1, $2, $3, $4, $5)', calleeQueryArray, (error) => {
            if (error) throw error;
          });
          if (participantsArray.indexOf(obj.callee) < 0 ) participantsArray.push(obj.callee);
          if (participantsArray.indexOf(obj.caller) < 0 ) participantsArray.push(obj.caller);
        }
        done();
        if (i === fileObjs.length -1 ) {
          if (participantsArray.length > 0) {
            pollCalls.retrieveCallerDetails(companyName, participantsArray, (res) => {
              if (res.numrows === 0) {
                console.log('no data returned from api call to IPC');
              }
              else {
                res.values.forEach((extObj) => {
                  const queryArray = [true,extObj.owner, extObj.company, extObj.virt_exten];
                  dbClient.query('UPDATE participants SET internal=($1), contact_id=($2) WHERE company_id=(SELECT company_id FROM companies WHERE company_name=$3) AND number=($4)',
                queryArray, (error, response) => {
                  console.log(response, '<---- response');
                });
                });
              }
            });
          }
          else {
            console.log('no new participants were added');
          }
        }
      });
    });
  });
});
