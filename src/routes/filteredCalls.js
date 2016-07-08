// const fetchCalls = require('../db/fetchCalls.js');
const validate = require('../auth/validate.js');
// const pg = require('pg');
const JWT = require('jsonwebtoken');
// const postgresURL = process.env.POSTGRES_URL;

module.exports = {
  method: 'POST',
  path: '/filtered-calls',
  handler: (request, reply) => {
    const filterSpec = JSON.parse(request.payload);
    const decoded = JWT.decode(request.state.token);
    validate(decoded, request, (error, isValid) => {
      if (error || !isValid) {
        return reply.redirect('/').unstate('token');
      }
      else {
        // pg.connect(postgresURL, (err, dbClient, done) => {
        //   if (err) throw err;
        //
        //   fetchCalls.fetchCalls(dbClient, done, 4387735, 101, (result) => {
        //     const calls = {
        //       calls: result
        //     };
        reply.redirect('/dashboard');
          // });
        // });
      }
    });
  }
};
