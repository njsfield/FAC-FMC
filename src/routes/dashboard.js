const dbFetchCalls = require('../db/dbFetchCalls.js');
const validate = require('../auth/validate.js');
const pg = require('pg');
const JWT = require('jsonwebtoken');

module.exports = {
  method: 'GET',
  path: '/dashboard',
  handler: (request, reply) => {
    const decoded = JWT.decode(request.state.token);
    validate(decoded, request, (error, isValid) => {
      if (error || !isValid) {
        return reply.view('login').unstate('token');
      }
      else {
        const contact_id = request.params;
        const company_id = request.params.company_id;
        const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc';
        pg.connect(postgresURL, (err, client, done) => {
          if (err) throw err;
          dbFetchCalls.fetchCalls(client, done, 4387735, 101, (result) => {
            const calls = {
              calls: result
            };
            reply.view('dashboard', calls);
          });
        });
      }
    });
  }
};
// 4387735/101
