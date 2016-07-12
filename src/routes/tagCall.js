const pg = require('pg');
const postgresURL = process.env.POSTGRES_URL;
const JWT = require('jsonwebtoken');
const checkTables = require('../../polling/db/checkTables.js');
const getIds = require('../../polling/db/getIds.js');
const insert = require('../../polling/db/insertData.js');
const validate = require('../auth/validate.js');

module.exports = {
  method: 'post',
  path: '/tag-call',
  handler: (request, reply) => {
    const decoded = JWT.decode(request.state.token);
    var regex = /^\s+$/ ;
    validate(decoded, request, (error, isValid) => {
      if (error || !isValid) {
        return reply.redirect('/').unstate('token');
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
          checkTables.checkTagsTable(dbClient, tag, () => {

            getIds.getTag_id(dbClient, tag, (tag_id) => {
              const tagsCalls = {
                tag_id: tag_id,
                call_id: request.payload.call_id
              };
              insert.addToTagsCallsTable(dbClient, tagsCalls, () => {
                reply.redirect('/dashboard');
                done();
              });
            });
          });
        });
      }
    });
  }
};
