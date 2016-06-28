const pg = require('pg');
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc';
const JWT = require('jsonwebtoken');
const checkTable = require('../../polling/dbFunctions/checkTable.js');
const getId = require('../../polling/dbFunctions/getID.js');
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
            checkTable.checkTagsTable(dbClient, tag, done);
            reply.redirect('/dashboard');
          });
        });
      }
    });
  }
};
