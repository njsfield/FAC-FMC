const dbFetchCalls2 = require('../db/dbFetchCalls2.js');
const validate = require('../auth/validate.js');
const pg = require('pg');
const JWT = require('jsonwebtoken');
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc';
const queryString = 'select * from participants p inner join calls c on p.call_id = c.call_id and p.company_id = c.company_id left join tags_calls t on c.call_id = t.call_id where ';

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
        dbFetchCalls2.createQueryString(queryString, userObj, (qString) => {
          pg.connect(postgresURL, (err, dbClient, done) => {
            if (err) throw err;
            dbClient.query(qString, [100, 4387735], (err2, res) => {
              console.log(res, '<----- res');
            });
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
//     dbFetchCalls.fetchCalls(dbClient, done, 4387735, 101, (result) => {
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
