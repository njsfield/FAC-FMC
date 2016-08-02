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
            checkTagsTable(dbClient, tag, (err1) => {
              if (err1) {
                console.log(err1);
                done();
                return reply.redirect('/error/' + encodeURIComponent('unable to retrieve tags'));
              } else {
                getTag_id(dbClient, tag, (err2, tag_id) => {
                  if (err2) {
                    console.log(err2);
                    done();
                    return reply.redirect('/error/' + encodeURIComponent('unable to get Tag id '));
                  } else {
                    const tagsCalls = {
                      tag_id: tag_id,
                      call_id: request.payload.call_id
                    };
                    insertIntoTagsCallsTable(dbClient, tagsCalls, () => {
                      reply.redirect('/dashboard').state('FMC', request.state.FMC, cookieOptions);
                      done();
                    });
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
