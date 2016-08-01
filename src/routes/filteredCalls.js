const filterQueryStringCreator = require('../db/filterQueryStringCreator.js');
const getFilterNameAndSpec = require('../../src/db/getFilterNameAndSpec.js');
const getTagNames = require('../../src/db/getTagNamesArr.js');
const validate = require('../auth/validate.js');
const pg = require('pg');
const JWT = require('jsonwebtoken');
const cookieOptions = require('../auth/cookieOptions.js');
const postgresURL = process.env.POSTGRES_URL;

module.exports = {
  method: 'POST',
  path: '/filtered-calls',
  config: {auth: false},
  handler: (request, reply) => {
    if (request.state.FMC) {
      const filterSpec = JSON.parse(request.payload);
      console.log(filterSpec, '<---- filterSpec');
      const decoded = JWT.decode(request.state.FMC);
      validate(decoded, request, (error, isValid) => {
        if (error || !isValid) {
          return reply.redirect('/').unstate('FMC');
        }
        else {
          pg.connect(postgresURL, (err, dbClient, done) => {
            if (err) throw err;
            const queryArray = [decoded.contact_id, decoded.company_id];
            filterQueryStringCreator.createQueryString(queryArray, filterSpec, (qString, qa) => {
              dbClient.query(qString, qa, (err2, res) => {
                getFilterNameAndSpec(dbClient, decoded, done, (filters) => {
                  getTagNames(dbClient, decoded, done, (err1, savedTags) => {
                    if (err1) {
                      console.log(err1);
                      return reply.redirect('/error/' + encodeURIComponent('unable to get Tag names '));
                    } else {
                      res.rows.forEach( (call) => {
                        const date = call.date.toString().substr(4, 7);
                        const time = call.date.toString().substr(16, 5);
                        call.date = date + ', ' + time;
                        const totalSec = call.duration;
                        const hours = parseInt( totalSec / 3600 ) % 24;
                        const minutes = parseInt( totalSec / 60 ) % 60;
                        const seconds = totalSec % 60;
                        call.duration = (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
                      });
                      const userCalls = {
                        calls: res.rows,
                        filters,
                        savedTags
                      };
                      reply.view('dashboard', userCalls).state('FMC', request.state.FMC, cookieOptions);
                      done();
                    }
                  });
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
