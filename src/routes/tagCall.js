const pg = require('pg');
const postgresURL = process.env.POSTGRES_URL;
const JWT = require('jsonwebtoken');
const {checkTagsTable} = require('../db/checkTables.js');
const {getTag_id} = require('../db/getIds.js');
const {insertIntoTagsCallsTable} = require('../db/insertData.js');
const validate = require('../auth/validate.js');
const cookieOptions = require('../auth/cookieOptions.js');

module.exports = {
  method: 'post',
  path: '/tag-call',
  config: {auth: false},
  handler: (request, reply) => {
    if (request.state.FMC) {
      const decoded = JWT.decode(request.state.FMC);
      var regex = /^\s+$/ ;
      validate(decoded, request, (error, isValid) => {
        if (error || !isValid) {
          return reply.redirect('/').unstate('FMC');
        }
        else if (request.payload.tag.match(regex) || request.payload.tag === '') {
          return reply.redirect('/dashboard');
        }
      else {
          pg.connect(postgresURL, (err, dbClient, done) => {
            if (err) throw err;
            const tag = {
              tag_name: request.payload.tag,
              company_id: decoded.company_id
            };
            checkTagsTable(dbClient, tag, done, () => {

              getTag_id(dbClient, tag, done, (tag_id) => {
                const tagsCalls = {
                  tag_id: tag_id,
                  call_id: request.payload.call_id
                };
                insertIntoTagsCallsTable(dbClient, tagsCalls, done, () => {
                  reply.redirect('/dashboard').state('FMC', request.state.FMC, cookieOptions);
                  done();
                });
              });
            });
          });
        }
      });
    } else {
      return reply.redirect('/');
    }
  }
};
