const checkTables = require('../../polling/db/checkTables.js');
const validate = require('../auth/validate.js');
const pg = require('pg');
const JWT = require('jsonwebtoken');
const postgresURL = process.env.POSTGRES_URL;

module.exports = {
  method: 'POST',
  path: '/save-filter',
  handler: (request, reply) => {
    const decoded = JWT.decode(request.state.token);

    const parsePayload = JSON.parse(request.payload);
    const filterObj = {
      filter_name: parsePayload.filter_name,
      contact_id: decoded.contact_id,
      filter_spec: {
        to: parsePayload.to,
        from: parsePayload.from,
        'duration-min': parsePayload.duration_min,
        'duration-max': parsePayload.duration_max,
        date: parsePayload.date,
        tags: parsePayload.tags,
        saved_tags: parsePayload.saved_tags,
        untagged: parsePayload.untagged
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
          checkTables.checkFiltersTable(dbClient, filterObj, (res) => {
            reply.redirect('/dashboard');
          });
        });
      }
    });
  }
};
