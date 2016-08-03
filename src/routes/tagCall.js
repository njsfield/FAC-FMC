const pg = require('pg');
const postgresURL = process.env.POSTGRES_URL;
const JWT = require('jsonwebtoken');
const {checkTagsTable} = require('../db/checkTables.js');
const {getTag_id} = require('../db/getIds.js');
const {insertIntoTagsCallsTable} = require('../db/insertData.js');
const validate = require('../auth/validate.js');

module.exports = {
  method: 'post',
  path: '/tag-call/{tag_name}/{call_id}',
  config: {auth: false},
  handler: (request, reply) => {
    if (request.state.FMC) {
      const decoded = JWT.decode(request.state.FMC);
      validate(decoded, request, (error, isValid) => {
        var tag_name = (request.params.tag_name || '').replace(/^\s+|\s+$/g,'');
        if (error || !isValid) {
          return reply.redirect('/').unstate('FMC');
        }
        else if (tag_name.search(/[^\w\s\d]/)>=0) {
          reply(JSON.stringify({success: 'fail', tag: {}, message: 'invalid tag name'})).type('application/json');
          // return reply.redirect('/dashboard');
        }
        else {
          pg.connect(postgresURL, (err, dbClient, done) => {
            if (err) throw err;
            const tag = {
              tag_name: request.params.tag_name.replace(/^\s+|\s+$/g,''),
              call_id: request.params.call_id,
              company_id: decoded.company_id
            };
            checkTagsTable(dbClient, tag, (err1) => {
              if (err1) {
                console.log(err1);
                done();
                reply(JSON.stringify({success: 'fail', tag: tag})).type('application/json');
              } else {
                getTag_id(dbClient, tag, (err2, tag_id) => {
                  if (err2) {
                    console.log(err2);
                    done();
                    reply(JSON.stringify({success: 'fail', tag: tag})).type('application/json');
                  } else {
                    const tagsCalls = {
                      tag_id: tag_id,
                      call_id: request.params.call_id
                    };
                    insertIntoTagsCallsTable(dbClient, tagsCalls, (err3, res) => {
                      if (res) {
                        tag.tag_id = tag_id;
                        reply(JSON.stringify({success: 'success', tag: tag})).type('application/json');
                      } else {
                        reply(JSON.stringify({success: 'success', tag: 'already exists'})).type('application/json');
                      }
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
