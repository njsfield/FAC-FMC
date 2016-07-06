const dbCheckTables = require('../../polling/dbFunctions/checkTable.js');
const validate = require('../auth/validate.js');
const pg = require('pg');
const JWT = require('jsonwebtoken');
const postgresURL = process.env.POSTGRES_URL;

module.exports = {
  method: 'POST',
  path: '/save-filter',
  handler: (request, reply) => {
    const decoded = JWT.decode(request.state.token);

    const filterObj = {
      filter_name: request.payload.filter_name,
      contact_id: decoded.contact_id,
      filter_spec: {
        to: request.payload.to,
        from: request.payload.from,
        'duration-min': request.payload.duration_min,
        'duration-max': request.payload.duration_max,
        date: request.payload.date,
        tags: request.payload.tags
      }
    };
    validate(decoded, request, (error, isValid) => {
      if (error || !isValid) {
        return reply.redirect('/').unstate('token');
      }
      else {
        console.log('string');
        pg.connect(postgresURL, (err, dbClient) => {
          if (err) throw err;
          dbCheckTables.checkFiltersTable(dbClient, filterObj, (res) => {
            reply.redirect('/dashboard');
          });
        });
      }
    });
  }
};
