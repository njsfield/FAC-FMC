const filterQueryStringCreator = require('../db/filterQueryStringCreator.js');
const getFilterNameAndSpec = require('../../src/db/getFilterNameAndSpec.js');
const getTagNames = require('../../src/db/getTagNamesArr.js');
const validate = require('../auth/validate.js');
const pg = require('pg');
const JWT = require('jsonwebtoken');
const postgresURL = process.env.POSTGRES_URL;
// const queryString = 'select date, file_id, contact_id, participant_role, number, internal, duration, tag_id from participants p inner join calls c on p.call_id = c.call_id and p.company_id = ($1) and p.contact_id = ($2) left join tags_calls t on c.call_id = t.call_id where ';

const queryString = `SELECT calls.*,
   participants1.participant_id AS caller_id, participants1.internal AS caller_internal, participants1.number AS caller_number, participants1.contact_id AS caller_contact,
   participants2.participant_id AS callee_id, participants2.internal AS callee_internal, participants2.number AS callee_number, participants2.contact_id AS callee_contact,
   array(select tag_name from tags where tag_id in (select tag_id from tags_calls where tags_calls.call_id = calls.call_id)) AS tag_name
FROM calls
    LEFT JOIN participants participants1 ON calls.call_id = participants1.call_id AND participants1.participant_role = 'caller'
    LEFT JOIN participants participants2 ON calls.call_id = participants2.call_id AND participants2.participant_role = 'callee'
WHERE (participants1.contact_id=$1 OR participants2.contact_id=$1) AND calls.company_id=$2 `;

module.exports = {
  method: 'GET',
  path: '/dashboard',
  handler: (request, reply) => {

    const decoded = JWT.decode(request.state.token);
    const userObj = {
      to: '',
      from: '',
      min: '',
      max: '',
      date: '',
      tags: ['important', 'business']
    };

    validate(decoded, request, (error, isValid) => {
      if (error || !isValid) {
        return reply.redirect('/').unstate('token');
      }
      else {
        pg.connect(postgresURL, (err, dbClient, done) => {
          if (err) throw err;
          const queryArray = [4387735, 100];
          filterQueryStringCreator.createQueryString(queryString, queryArray, userObj, (qString, qa) => {
            dbClient.query(qString, qa, (err2, res) => {
              getFilterNameAndSpec.getFilterNameAndFilterSpec(dbClient, decoded, (filters) => {
                getTagNames.getFilterTagNamesArr(dbClient, decoded, (savedTags) => {
                  const userCalls = {
                    calls: res.rows,
                    filters,
                    savedTags
                  };
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
