const pg = require('pg');
const postgresURL = process.env.POSTGRES_URL;
const JWT = require('jsonwebtoken');
const validate = require('../auth/validate.js');
const errorHandler = require('../../errorHandler.js');
const deleteTag = require('../db/deleteTag.js');
const {getTag_id} = require('../db/getIds.js');
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
            getTag_id(dbClient, deleteTagObj, (err1, tag_id) => {
              console.log("DELETE OBJ: ",deleteTagObj);
              console.log("TAG ID: ",tag_id);
              console.log("ERR1: ",err1);
              if (err1) {
                errorHandler(err1);
                reply(JSON.stringify({success: 'fail', tag:deleteTagObj})).type('application/json');
              } else {
                deleteTagObj.tag_id = tag_id;
                deleteTag(dbClient, deleteTagObj, (err2) => {
                  if (err2) {
                    errorHandler(err2);
                    reply(JSON.stringify({success: 'fail', tag:deleteTagObj})).type('application/json');
                  } else {
                    reply(JSON.stringify({success: 'success', tag:deleteTagObj})).type('application/json');
                    // reply.redirect('/dashboard').state('FMC', request.state.FMC, cookieOptions);
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
