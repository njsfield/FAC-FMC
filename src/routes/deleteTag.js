const pg = require('pg');
const postgresURL = process.env.POSTGRES_URL;
const JWT = require('jsonwebtoken');
const validate = require('../auth/validate.js');

module.exports = {
  method: 'delete',
  path: '/delete-tag',
  handler: (request, reply) => {
    const decoded = JWT.decode(request.state.token);
    validate(decoded, request, (error, isValid) => {
      if (error || !isValid) {
        return reply.redirect('/').unstate('token');
      }
      else {
        pg.connect(postgresURL, (err, dbClient, done) => {
          if (err) throw err;

        });
      }
    });
  }
};
