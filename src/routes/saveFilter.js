const {checkFiltersTable} = require('../db/checkTables.js');
const validate = require('../auth/validate.js');
const pg = require('pg');
const JWT = require('jsonwebtoken');
const postgresURL = process.env.POSTGRES_URL;
const errorHandler = require('../../errorHandler.js');

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
          duration_min: parsePayload.duration_min,
          duration_max: parsePayload.duration_max,
          date: parsePayload.date,
          dateRange: parsePayload.dateRange,
          tags: parsePayload.tags,
          untagged: parsePayload.untagged,
          include_hidden: parsePayload.include_hidden
        }
      };
      validate(decoded, request, (error, isValid) => {
        if (error || !isValid) {
          return reply.redirect('/').unstate('FMC');
        }
        else {
          pg.connect(postgresURL, (err, dbClient, done) => {
            if (err) throw err;
            checkFiltersTable(dbClient, filterObj, (err1, res) => {
              if (err1) {
                errorHandler(err1);
                reply({success: res.success, message: 'check filters table errored'});
              } else {
                reply(JSON.stringify({success: res.success, message: res.message || '' , description: JSON.stringify(filterObj.filter_spec)})).type('application/json');
              }
              done();
            });
          });
        }
      });
    } else {
      return reply.redirect('/');
    }
  }
};
