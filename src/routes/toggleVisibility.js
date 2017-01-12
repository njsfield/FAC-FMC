const pg = require('pg');
const postgresURL = process.env.POSTGRES_URL;
const JWT = require('jsonwebtoken');
const validate = require('../auth/validate.js');
const errorHandler = require('../../errorHandler.js');
const toggleVisibility = require('../db/callVisibility.js');

module.exports = {
  method: 'post',
  path: '/toggle-visibility/{call_id}',
  config: {auth: false},
  handler: (request, reply) => {
    const decoded = JWT.decode(request.state.FMC);

    if (request.state.FMC) {
      const toggleCallVisObj = {
        call_id: request.params.call_id,
        contact_id: decoded.contact_id,
        company_id: decoded.company_id
      };

      validate(decoded, request, (error, isValid) => {
        if (error || !isValid) {
          return reply.redirect('/').unstate('FMC');
        }
        else {
          pg.connect(postgresURL, (err, dbClient, done) => {
            toggleVisibility(dbClient, toggleCallVisObj, (err1, newState) => {
              if (err1) {
                errorHandler(err1);
                reply(JSON.stringify({success: 'fail', data: toggleCallVisObj})).type('application/json');
              } else {
                reply(JSON.stringify({success: 'success', tag: toggleCallVisObj, newState: newState})).type('application/json');
                // reply.redirect('/dashboard').state('FMC', request.state.FMC, cookieOptions);
              }
              done();
            });
          });
        }
      });
    }
    else {
      return reply.redirect('/');
    }
  }
};
