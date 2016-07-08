const fetchCalls = require('../db/fetchCalls.js');
const getFilterNameAndSpec = require('../../src/db/getFilterNameAndSpec.js');
const getTagNames = require('../../src/db/getTagNamesArr.js');
const validate = require('../auth/validate.js');
const pg = require('pg');
const JWT = require('jsonwebtoken');
const postgresURL = process.env.POSTGRES_URL;

module.exports = {
  method: 'GET',
  path: '/dashboard',
  handler: (request, reply) => {
    const decoded = JWT.decode(request.state.token);
    validate(decoded, request, (error, isValid) => {
      if (error || !isValid) {
        return reply.redirect('/').unstate('token');
      }
      else {
        pg.connect(postgresURL, (err, dbClient, done) => {
          if (err) throw err;
          dbClient.query('SELECT company_id FROM users WHERE contact_id=($1)', [decoded.contact_id], (err2, res) => {
            if (err2) throw err2;
            fetchCalls.fetchCalls(dbClient, done, 4387735, 101, (calls) => {
              getFilterNameAndSpec.getFilterNameAndFilterSpec(dbClient, decoded, (filters) => {
                getTagNames.getTagNamesArr(dbClient, decoded, (tags) => {
                  const userCalls = {
                    calls,
                    filters,
                    tags
                  };
                  reply.view('dashboard', userCalls);
                });
              });
            });
          });
        });
      }
    });
  }
};
// contact_id hard=4387735
// company_id hard=101
// contact_id soft=decoded.contact_id
// company_id soft=res.rows[0].company_id
