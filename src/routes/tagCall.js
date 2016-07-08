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
    validate(decoded, request, (error, isValid) => {
      if (error || !isValid) {
        return reply.redirect('/').unstate('token');
      }
      else {
        pg.connect(postgresURL, (err, dbClient, done) => {
          if (err) throw err;
          const tag = {
            tag_name: request.payload.tag,
            company_id: decoded.company_id
          };
          console.log(tag);
          checkTables.checkTagsTable(dbClient, tag, () => {

            getIds.getTag_id(dbClient, tag, (tag_id) => {
              const tagsCalls = {
                tag_id: tag_id,
                call_id: request.payload.call_id
              };
              console.log(tagsCalls, 'tagsCalls-------');
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
