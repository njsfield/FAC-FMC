const dbFetchCalls = require('../db/dbFetchCalls.js');
const validate = require('../auth/validate.js');
const pg = require('pg');
const JWT = require('jsonwebtoken');
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc';

module.exports = {
  method: 'POST',
  path: '/save-filter',
  handler: (request, reply) => {
    console.log(request.payload, '<---- payload');
    const decoded = JWT.decode(request.state.token);
    validate(decoded, request, (error, isValid) => {
      if (error || !isValid) {
        return reply.redirect('/').unstate('token');
      }
      else {
        pg.connect(postgresURL, (err, dbClient, done) => {
          if (err) throw err;

          dbFetchCalls.fetchCalls(dbClient, done, 4387735, 101, (result) => {
            const calls = {
              calls: result
            };
            console.log(result, '<----filter');
            reply.view('dashboard', calls);
          });
        });
      }
    });
  }
};
