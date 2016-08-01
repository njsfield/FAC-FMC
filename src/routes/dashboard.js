const filterQueryStringCreator = require('../db/filterQueryStringCreator.js');
const getFilterNameAndSpec = require('../../src/db/getFilterNameAndSpec.js');
const getTagNames = require('../../src/db/getTagNamesArr.js');
const validate = require('../auth/validate.js');
const pg = require('pg');
const JWT = require('jsonwebtoken');
const postgresURL = process.env.POSTGRES_URL;
const cookieOptions = require('../auth/cookieOptions.js');

module.exports = {
  method: 'GET',
  path: '/dashboard',
  config: {auth: false},
  handler: (request, reply) => {
    let baseUrl = createURL(request.url.search);
    if (request.state.FMC) {
      const decoded = JWT.decode(request.state.FMC);
      let userObj = formatUserObj(request);
      validate(decoded, request, (error, isValid) => {
        if (error || !isValid) {
          return reply.redirect('/').unstate('FMC');
        }
        else {
          pg.connect(postgresURL, (err, dbClient, done) => {
            if (err){
              console.log(err);
              reply.redirect('/error/' + encodeURIComponent('error connecting to the database'));
            } else {
              const queryArray = [decoded.contact_id, decoded.company_id];
              filterQueryStringCreator.createQueryString(queryArray, userObj, (qString, qArray) => {
                dbClient.query(qString, qArray, (err2, res) => {
                  if (err2) {
                    console.log(err2);
                    return reply.redirect('/error/' + encodeURIComponent('error retrieveing your calls'));
                  } else {
                    getFilterNameAndSpec(dbClient, decoded, done, (err3, filters) => {
                      if (err) {
                        console.log(err);
                        return reply.redirect('/error/' + encodeURIComponent('error retrieving your calls'));
                      } else {
                        getTagNames(dbClient, decoded, done, (err4, savedTags) => {
                          if (err4) {
                            console.log(err4);
                            return reply.redirect('/error/' + encodeURIComponent('unable to get Tag names'));
                          } else {
                            res.rows.forEach( (call) => {
                              call.duration = formatCallDuration(call);
                            });
                            userObj.tags = userObj.tags.join(';');
                            const userCalls = {
                              calls: res.rows,
                              filters,
                              savedTags,
                              userObj
                            };
                            if (res.rows.length > userObj.maxRows) {
                              userCalls.nextPage = baseUrl + (baseUrl === '' ? '?' : '&') + 'firstIndex=' + (userObj.firstIndex + userObj.maxRows);
                              res.rows.length = userObj.maxRows;
                            }
                            if (userObj.firstIndex > 0) {
                              userCalls.prevPage = baseUrl + (baseUrl === '' ? '?' : '&') + 'firstIndex=' + Math.max(0, userObj.firstIndex - userObj.maxRows);
                            }
                            reply.view('dashboard', userCalls).state('FMC', request.state.FMC, cookieOptions);
                            done();
                          }
                        });
                      }
                    });
                  }
                });
              });
            }
          });
        }
      });
    } else {
      return reply.redirect('/');
    }
  }
};

const createURL = (requestSearch) => {
  let baseUrl = requestSearch.replace(/firstIndex\=\d+\&?/,'');
  if (baseUrl == '?') baseUrl = '';
  return baseUrl;
};

const formatUserObj = (request)=> {
  let userObj = {
    to: '',
    from: '',
    min: '',
    max: '',
    date: '',
    tags: [],
    untagged: false,
    firstIndex: 0,
    maxRows: 20
  };
  if (request.query!=null) {
    if (request.query.to!=null)
      userObj.to = request.query.to;
    if (request.query.from!=null)
      userObj.from = request.query.from;
    if (request.query.min!=null)
      userObj.min = request.query.min;
    if (request.query.max!=null)
      userObj.max = request.query.max;
    if (request.query.date!=null)
      userObj.date = request.query.date;
    if (request.query.untagged!=null)
      userObj.untagged = true;
    else {
      if (request.query.tags!=null && request.query.tags.search(/\S/)>=0)
        userObj.tags = request.query.tags.split(';');
      if(request.query.company_tag!=null)
        userObj.tags = userObj.tags.concat(request.query.company_tag);
    }
    if (request.query.firstIndex!=null && !isNaN(request.query.firstIndex))
      userObj.firstIndex = parseInt(request.query.firstIndex, 10);
  }
  return userObj;
};

const formatCallDuration = (call) => {
  const totalSec = call.duration;
  const minutes = parseInt( totalSec / 60 );
  const seconds = totalSec % 60;
  return (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
};
