'use strict';

const fs = require('fs');
const getFile_id = require('./db/getIds.js').getFile_id;
const pollCalls = require('./api/pollingCalls.js');
const pollerFlow = require('./db/pollerFlow.js').pollerFlow;
const insertData = require('./db/insertData.js');
const updateData = require('./db/updateData.js').updateParticipantsTable;
let participantsArray = [];

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
 * Update the participants table -> pollingCalls/retrieveCallerDetails(participants)
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
const storeCompanyCalls = (dbClient, done, companyName) => {
  console.log('hey');
  pollCalls.retrieveCompanyCalls(companyName, (fileObjs) => {
    participantsArray = [];
    fileObjs.forEach((obj, i) => {
      pollerFlow(dbClient, done, obj, (result) => {
        if(result.command === 'INSERT') {

          const callerQueryObj = createCallParticipantObj(obj, 'caller');
          insertData.addToParticipantsTable(dbClient, callerQueryObj, () => {
          });

          const calleeQueryObj= createCallParticipantObj(obj, 'callee');
          insertData.addToParticipantsTable(dbClient, calleeQueryObj, () => {
          });

          checkParticipantsArray([obj.callee, obj.caller]);

          // pollCalls.retrieveWav(obj.file_name, (data) => {
          //   getFile_id(dbClient, obj, (fileId) => {
          //     fs.writeFileSync(process.env.SAVE_FILE_PATH + `/${fileId}.wav`, data);
          //   });
          // });
        }
        done();

          // this function is called once all the participants have been checked
        if (i === fileObjs.length -1 ) {
          if (participantsArray.length > 0) {

            pollCalls.retrieveCallerDetails(companyName, participantsArray, (res) => {

              if (res.numrows === 0) {
                console.log('no data returned from api call to IPC');
              }
              else {
                res.values.forEach((extObj) => {
                  updateData(dbClient, extObj, () => {
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

const checkParticipantsArray = (callParticipants) => {
  callParticipants.forEach ( (participant) => {
    if (participantsArray.indexOf(participant) < 0 ) participantsArray.push(participant);
  });
};

module.exports = {
  storeCompanyCalls
};
