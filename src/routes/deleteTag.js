const pg = require('pg');
const postgresURL = process.env.POSTGRES_URL;
const JWT = require('jsonwebtoken');
const validate = require('../auth/validate.js');
const deleteTag = require('../db/deleteTag.js');
const getTagId = require('../db/getTagIdForDeletion.js');
const cookieOptions = require('../auth/cookieOptions.js');

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
            getTagId.getTagIdForDeletion(dbClient, deleteTagObj, (err1, tag_id) => {
              if (err1) {
                console.log(err1);
                return reply.redirect('/error/' + encodeURIComponent('unable to get Tag id '));
              } else {
                deleteTagObj.tag_id = tag_id;
                deleteTag(dbClient, deleteTagObj, (err2) => {
                  if (err2) {
                    console.log(err2);
                    return reply.redirect('/error/' + encodeURIComponent('unable to delete tag'));
                  } else {
                    reply.redirect('/dashboard').state('FMC', request.state.FMC, cookieOptions);
                  }
                });
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
