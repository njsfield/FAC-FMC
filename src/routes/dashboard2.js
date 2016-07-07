const filterQueryStringCreator = require('../db/filterQueryStringCreator.js');
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
WHERE `;

module.exports = {
  method: 'GET',
  path: '/dashboard2',
  handler: (request, reply) => {

    const decoded = JWT.decode(request.state.token);
    const userObj = {
      to: '',
      from: '',
      min: '',
      max: '',
      date: '',
      tags: ''
    };

    validate(decoded, request, (error, isValid) => {
      if (error || !isValid) {
        return reply.redirect('/').unstate('token');
      }
      else {
        pg.connect(postgresURL, (err, dbClient, done) => {
          if (err) throw err;
          filterQueryStringCreator.createQueryString(queryString, userObj, (qString) => {
            console.log(qString, '<<<<<<<<<<<qString');
            // console.log(decoded.contact_id);
            // dbClient.query(qString, [decoded.company_id, 4387735], (err2, res) => {
            // });
          });
        });
      }
    });
  }
};

// pg.connect(postgresURL, (err, dbClient, done) => {
//   if (err) throw err;
//   dbClient.query('SELECT company_id FROM users WHERE contact_id=($1)', [decoded.contact_id], (err2, res) => {
//     if (err2) throw err2;
//     fetchCalls.fetchCalls(dbClient, done, 4387735, 101, (result) => {
//       console.log(result, '<----- result');
//       const calls = {
//         calls: result
//       };
//       reply.view('dashboard', calls);
//     });
//   });
// });

// contact_id hard=4387735
// company_id hard=101
// contact_id soft=decoded.contact_id
// company_id soft=res.rows[0].company_id
