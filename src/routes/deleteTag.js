const pg = require('pg');
const postgresURL = process.env.POSTGRES_URL;
const JWT = require('jsonwebtoken');
const validate = require('../auth/validate.js');
const deleteTag = require('../db/deleteTag.js');
const getTagId = require('../db/getTagIdForDeletion.js');

module.exports = {
  method: 'post',
  path: '/delete-tag/{tag_name}/{call_id}',
  config: {auth: false},
  handler: (request, reply) => {
    const decoded = JWT.decode(request.state.FMC);

    if (request.state.FMC) {

      const deleteTagObj = {
        tag_name: request.params.tag_name,
        call_id: request.params.call_id,
        company_id: decoded.company_id
      };

      validate(decoded, request, (error, isValid) => {
        if (error || !isValid) {
          return reply.redirect('/').unstate('FMC');
        }
        else {
          pg.connect(postgresURL, (err, dbClient) => {
            if (err) throw err;
            getTagId.getTagIdForDeletion(dbClient, deleteTagObj, (tag_id) => {
              deleteTagObj.tag_id = tag_id;
              deleteTag.deleteTag(dbClient, deleteTagObj, () => {
                reply.redirect('/dashboard');
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
