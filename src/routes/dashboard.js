const filterQueryStringCreator = require('../db/filterQueryStringCreator.js');
const getFilterNameAndSpec = require('../../src/db/getFilterNameAndSpec.js');
const getTagNames = require('../../src/db/getTagNamesArr.js');
const errorHandler = require('../../errorHandler.js');
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
      let userObj = formatUserObj(request, decoded);

      validate(decoded, request, (error, isValid) => {
        if (error || !isValid) {
          return reply.redirect('/').unstate('FMC');
        }
        else {
          pg.connect(postgresURL, (err, dbClient, done) => {
            if (err){
              errorHandler(err);
              reply.view('login', {loginErr: 'Apologies we cannot log you on at the moment, try again later'});
              done();
            } else {
              const queryArray = [];
              filterQueryStringCreator.createQueryString(queryArray, userObj, (qString, qArray) => {
                dbClient.query(qString, qArray, (err2, res) => {
                  if (err2) {
                    errorHandler(err2);
                    done();
                    return reply.view('dashboard', {callError: 'no calls for these parameters'}).state('FMC', request.state.FMC, cookieOptions);
                  } else {
                    getFilterNameAndSpec(dbClient, decoded, (err3, filters) => {
                      if (err3) {
                        errorHandler(err3);
                        return reply.view('dashboard', {callError: 'no calls for these parameters'}).state('FMC', request.state.FMC, cookieOptions);
                      } else {
                        getTagNames(dbClient, decoded, (err4, savedTags) => {
                          if (err4) {
                            errorHandler(err4);
                            return reply.view('dashboard', {callError: 'no calls for these parameters'}).state('FMC', request.state.FMC, cookieOptions);
                          }
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
                          userCalls.calls.forEach(c => {
                            if (c.tag_name.length>0) {
                              c.tag_label = [];
                              c.tag_name.forEach(t => c.tag_label.push({name:t,id:t+'^'+c.call_id}));
                            }
                          });
                          if (res.rows.length > userObj.maxRows) {
                            userCalls.nextPage = baseUrl + (baseUrl === '' ? '?' : '&') + 'firstIndex=' + (userObj.firstIndex + userObj.maxRows);
                            res.rows.length = userObj.maxRows;
                          }
                          if (userObj.firstIndex > 0) {
                            userCalls.prevPage = baseUrl + (baseUrl === '' ? '?' : '&') + 'firstIndex=' + Math.max(0, userObj.firstIndex - userObj.maxRows);
                          }
                          reply.view('dashboard', userCalls).state('FMC', request.state.FMC, cookieOptions);
                          done();
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

const formatUserObj = (request, user)=> {
  let isAdmin = (user.userRole==='admin');
  let userObj = {
    company_id: user.company_id,
    to: '',
    from: '',
    min: '',
    max: '',
    date: '',
    tags: [],
    untagged: false,
    firstIndex: 0,
    maxRows: 20,
    isAdmin: isAdmin,
    contactID: user.contact_id
  };
  if (isAdmin) {
    userObj.adminCompanies = user.adminCompanies;
    userObj.adminCompany = user.adminCompanies[0].name; // if for some reason no company is slected this will automatically
  }
  if (request.query!=null) {
    if (isAdmin && request.query.admin_company!=null) {
      userObj.adminCompanies.forEach((c) => {if (c.name==request.query.admin_company) c.selected='selected';});

      // The admin_company *must* be in the set of companies the current user can see.
      if (user.adminCompanies!=null && user.adminCompanies.some(c => c.name == request.query.admin_company)) {
        // OK - allowed to see calls for this company_id
        userObj.adminCompany = request.query.admin_company;
      }
      // If there's not selected admin country then default to the first company in the admins list
      if (userObj.adminCompany==null && user.adminCompanies.length>0) {
        userObj.adminCompany = user.adminCompanies[0].name;
      }
    }
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
