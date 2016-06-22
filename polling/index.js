const pollCalls = require('./api/polling_calls_api.js');
const pollerFlow = require('./dbFunctions/pollerFlow.js').pollerFlow;
const continuedPollerFlow = require('./dbFunctions/pollerFlow.js').continuedPollerFlow;
const insertData = require('./dbFunctions/insertData.js');
// const fs = require('fs')
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc';
const pg = require('pg');
const company_name = 'default';
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

pollCalls.updateFileNames(company_name, (files) => {
  var calleeList = [];
  var callerList = [];
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err;
    files.forEach((file, i) => {
      pollerFlow(client, done, file, (result) => {
        if(result.command === 'INSERT') {
          if (calleeList.indexOf(file.callee) < 0 ) calleeList = calleeList.concat([file.callee]);
          if (callerList.indexOf(file.caller) < 0 ) callerList = callerList.concat([file.caller]);
        }
        done();
        if (i === files.length -1 ) {
          if (callerList.length > 0) {
            callerList.forEach((el) => {
              pollCalls.retrieveCallerDetails(company_name, el, (res) => {
                if (res.numrows !== 0) {
                  const user = {
                    user_role: 'testing', //hard coded data that will need to be changed <---------
                    user_name: res.values[0].owner,
                    company_id: file.company_id
                  };
                  continuedPollerFlow(client, done, user, (res2) => {
                    const caller = {
                      call_id: file.call_id,
                      company_id: file.company_id,
                      number: res.values[0].scoped_exten,
                      internal: false,
                      participant_role: 'source',
                      user_id: res2
                    };
                    if (res.values[0].company === file.company_name) {
                      caller.internal = true;
                    }
                    insertData.addToParticipantsTable(client, caller, () => {
                      done();
                    });
                  });
                } else {
                  console.log('numrows was 0');
                }
              });
            });
          }
          else {
            console.log('callerList is empty');
          }
          if (calleeList.length > 0) {
            calleeList.forEach((el) => {
              pollCalls.retrieveCallerDetails(company_name, el, (res) => {
                if (res.numrows !== 0) {
                  const user = {
                    user_role: 'testing', //hard coded data that will need to be changed <---------
                    user_name: res.values[0].owner,
                    company_id: file.company_id
                  };
                  continuedPollerFlow(client, done, user, (res2) => {
                    const callee = {
                      call_id: file.call_id,
                      company_id: file.company_id,
                      number: res.values[0].scoped_exten,
                      internal: false,
                      participant_role: 'destination',
                      user_id: res2
                    };
                    if (res.values[0].company === file.company_name) {
                      callee.internal = true;
                    }
                    insertData.addToParticipantsTable(client, callee, () => {
                      done();
                    });
                  });
                } else {
                  console.log('numrows was 0');
                }
              });
            });
          }
          else {
            console.log('callee list is empty as well');
          }
        }
      });
    });
  });
});
