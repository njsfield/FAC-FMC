const checkTables = require('../../polling/db/checkTables.js');
const validate = require('../auth/validate.js');
const pg = require('pg');
const JWT = require('jsonwebtoken');
const postgresURL = process.env.POSTGRES_URL;

module.exports = {
  method: 'POST',
  path: '/save-filter',
  config: {auth: false},
  handler: (request, reply) => {
    if (request.state.FMC) {
      const decoded = JWT.decode(request.state.FMC);

      const parsePayload = JSON.parse(request.payload);
      const filterObj = {
        filter_name: parsePayload.filter_name,
        contact_id: decoded.contact_id,
        filter_spec: {
          to: parsePayload.to,
          from: parsePayload.from,
          min: parsePayload.duration_min,
          max: parsePayload.duration_max,
          date: parsePayload.date,
          tags: parsePayload.tags,
          untagged: parsePayload.untagged
        }
      };
      validate(decoded, request, (error, isValid) => {
        if (error || !isValid) {
          return reply.redirect('/').unstate('FMC');
        }
        else {
          pg.connect(postgresURL, (err, dbClient) => {
            if (err) throw err;
            checkTables.checkFiltersTable(dbClient, filterObj, (err1, res) => {
              if (err1) {
                console.log(err1);
                return reply.redirect('/error/' + encodeURIComponent('error checking filters table'));
              } else {
                reply(JSON.stringify({success: res.success, message: res.message || '' , description: JSON.stringify(filterObj.filter_spec)})).type('application/json');
              }
            });
          });
        }
      });
    } else {
      return reply.redirect('/');
    }
  }
};
