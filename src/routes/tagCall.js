const pg = require('pg');
const postgresURL = process.env.POSTGRES_URL;
const JWT = require('jsonwebtoken');
const checkTable = require('../../polling/dbFunctions/checkTable.js');
const getId = require('../../polling/dbFunctions/getID.js');
const insert = require('../../polling/dbFunctions/insertData.js');
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
          getId.getCompany_id(dbClient, decoded, (company_id) => {
            const tag = {
              tag_name: request.payload.tag,
              company_id: company_id
            };
            checkTable.checkTagsTable(dbClient, tag, () => {

              getId.getTag_id(dbClient, tag, (tag_id) => {
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
        });
      }
    });
  }
};
