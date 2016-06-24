'use strict';

const pollCalls = require('./api/polling_calls_api.js');
// const insertData = require('./dbFunctions/insertData.js');
const pollerFlow = require('./dbFunctions/pollerFlow.js').pollerFlow;
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc';
const pg = require('pg');
const companyName = 'default';

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
                  console.log(extObj, '<---- extObj');
                  const queryArray = [true, 102, extObj.virt_exten];
                  dbClient.query('UPDATE participants SET internal=($1) WHERE company_id=($2) AND number=($3))',
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
