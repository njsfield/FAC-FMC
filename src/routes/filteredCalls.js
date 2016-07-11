const filterQueryStringCreator = require('../db/filterQueryStringCreator.js');
const getFilterNameAndSpec = require('../../src/db/getFilterNameAndSpec.js');
const getTagNames = require('../../src/db/getTagNamesArr.js');
const validate = require('../auth/validate.js');
const pg = require('pg');
const JWT = require('jsonwebtoken');
const postgresURL = process.env.POSTGRES_URL;
const queryString = `SELECT calls.*,
   participants1.participant_id AS caller_id, participants1.internal AS caller_internal, participants1.number AS caller_number, participants1.contact_id AS caller_contact,
   participants2.participant_id AS callee_id, participants2.internal AS callee_internal, participants2.number AS callee_number, participants2.contact_id AS callee_contact,
   array(select tag_name from tags where tag_id in (select tag_id from tags_calls where tags_calls.call_id = calls.call_id)) AS tag_name
FROM calls
    LEFT JOIN participants participants1 ON calls.call_id = participants1.call_id AND participants1.participant_role = 'caller'
    LEFT JOIN participants participants2 ON calls.call_id = participants2.call_id AND participants2.participant_role = 'callee'
WHERE (participants1.contact_id=$1 OR participants2.contact_id=$1) AND calls.company_id=$2 `;

module.exports = {
  method: 'POST',
  path: '/filtered-calls',
  handler: (request, reply) => {
    const filterSpec = JSON.parse(request.payload);
    console.log(filterSpec, 'filterSpec---------------');
    const decoded = JWT.decode(request.state.token);
    validate(decoded, request, (error, isValid) => {
      if (error || !isValid) {
        return reply.redirect('/').unstate('token');
      }
      else {
        pg.connect(postgresURL, (err, dbClient, done) => {
          if (err) throw err;
          const queryArray = [decoded.contact_id, decoded.company_id];
          filterQueryStringCreator.createQueryString(queryString, queryArray, filterSpec, (qString, qa) => {
            console.log(qString);
            dbClient.query(qString, qa, (err2, res) => {
              getFilterNameAndSpec.getFilterNameAndFilterSpec(dbClient, decoded, (filters) => {
                getTagNames.getFilterTagNamesArr(dbClient, decoded, (savedTags) => {
                  const userCalls = {
                    calls: res.rows,
                    filters,
                    savedTags
                  };
                  console.log(userCalls.calls);
                  reply.view('dashboard', userCalls);
                  done();
                });
              });
            });
          });
        });
      }
    });
  }
};
