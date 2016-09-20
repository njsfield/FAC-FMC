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
              filterQueryStringCreator.createQueryString(queryArray, userObj, userObj.dateOrder, (qString, qArray) => {
                dbClient.query(qString, qArray, (err2, res) => {
                  if (err2) {
                    errorHandler(err2);
                    done();
                    return reply.view('dashboard', {callError: 'no calls for these parameters'}).state('FMC', request.state.FMC, cookieOptions);
                  } else {
                    getFilterNameAndSpec(dbClient, decoded, (err3, filters) => {
                      if (err3) {
                        errorHandler(err3);
                        done();
                        return reply.view('dashboard', {callError: 'no calls for these parameters'}).state('FMC', request.state.FMC, cookieOptions);
                      } else {
                        getTagNames(dbClient, decoded, (err4, savedTags) => {
                          if (err4) {
                            errorHandler(err4);
                            done();
                            return reply.view('dashboard', {filters, callError: 'no calls for these parameters'}).state('FMC', request.state.FMC, cookieOptions);
                          }
                          res.rows.forEach( (call) => {
                            call.duration = formatCallDuration(call.duration);
                          });
                          userObj.tags = userObj.tags.join(';');
                          userObj.min = formatSearchDuration(userObj.min);
                          userObj.max = formatSearchDuration(userObj.max);
                          const userCalls = {
                            filters,
                            savedTags,
                            userObj
                          };
                          if (res.rows.length === 0) {
                            userCalls.callError = 'no calls for these parameters';
                            done();
                            reply.view('dashboard', userCalls).state('FMC', request.state.FMC, cookieOptions);
                          } else {
                            userCalls.calls = res.rows;
                            userCalls.calls.forEach(c => {
                              if (c.tag_name.length>0) {
                                c.tag_label = [];
                                c.tag_name.forEach(t => c.tag_label.push({name: t,id: t+'^'+c.call_id}));
                              }
                            });
                            if (res.rows.length > userObj.maxRows) {
                              if (baseUrl.indexOf('&',baseUrl.length-1) !== -1) {
                                userCalls.nextPage = baseUrl + 'firstIndex=' + (userObj.firstIndex + userObj.maxRows);
                              } else {
                                userCalls.nextPage = baseUrl + (baseUrl === '' ? '?' : '&') + 'firstIndex=' + (userObj.firstIndex + userObj.maxRows);
                              }
                              res.rows.length = userObj.maxRows;
                            }

                            if (userObj.firstIndex > 0) {
                              if (baseUrl.indexOf('&',baseUrl.length-1) !== -1) {
                                userCalls.prevPage = baseUrl + 'firstIndex=' + Math.max(0, userObj.firstIndex - userObj.maxRows);
                              } else {
                                userCalls.prevPage = baseUrl + (baseUrl === '' ? '?' : '&') + 'firstIndex=' + Math.max(0, userObj.firstIndex - userObj.maxRows);
                              }
                            }

                            if (userObj.dateOrder === 'desc') {
                              if (baseUrl.indexOf('&',baseUrl.length-1) !== -1) {
                                userCalls.dateOrder = baseUrl + 'dateOrder=' + 'asc';
                              } else {
                                userCalls.dateOrder = baseUrl + (baseUrl === '' ? '?' : '&') + 'dateOrder=' + 'asc';
                              }
                            }
                            if (userObj.dateOrder === 'asc') {
                              if (baseUrl.indexOf('&',baseUrl.length-1) !== -1) {
                                userCalls.dateOrder = baseUrl + 'dateOrder=' + 'desc';
                              } else {
                                userCalls.dateOrder = baseUrl + (baseUrl === '' ? '?' : '&') + 'dateOrder=' + 'desc';
                              }
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

  if (baseUrl.indexOf('dateOrder=desc') !== -1) {
    baseUrl = baseUrl.replace(/dateOrder=asc\&?/, '');
    baseUrl = baseUrl.replace(/dateOrder=desc\&?/, '');
  }

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
    dateRange: '',
    dateRangeCheckbox: false,
    tags: [],
    untagged: false,
    firstIndex: 0,
    maxRows: 16,
    isAdmin: isAdmin,
    contactID: user.contact_id,
    dateOrder: 'desc',
    string: 'New to old'
  };
  if (isAdmin) {
    userObj.adminCompanies = user.adminCompanies;
    userObj.adminCompany = user.adminCompanies.filter(e => e.company_id == user.company_id)[0].name; // Select the home company as the default
  }
  if (request.query!=null) {
    if (isAdmin && request.query.admin_company!=null) {
      userObj.adminCompanies.forEach((c) => {if (c.name==request.query.admin_company) c.selected='selected';});

      // The admin_company *must* be in the set of companies the current user can see.
      if (user.adminCompanies!=null && user.adminCompanies.some(c => c.name == request.query.admin_company)) {
        // OK - allowed to see calls for this company_id
        userObj.adminCompany = request.query.admin_company;
      }
    }
    else if (isAdmin) {
      // If no company has been selected, default to the user's home company
      userObj.adminCompanies.forEach((c) => {if (c.company_id==user.company_id) c.selected='selected';});
    }
    if (request.query.to!=null)
      userObj.to = request.query.to;
    if (request.query.from!=null)
      userObj.from = request.query.from;
    if (request.query.min!=null && request.query.min.indexOf(':') !== -1) {
      const minHour = parseInt(request.query.min.split(':')[0], 10) * 60;
      const minMins = parseInt(request.query.min.split(':')[1], 10);
      const totalMinTime = minHour + minMins;
      if (!isNaN(totalMinTime) && totalMinTime>0) {
        userObj.min = totalMinTime;
      }
    }
    if (request.query.max!=null && request.query.max.indexOf(':') !== -1) {
      const maxHour = parseInt(request.query.max.split(':')[0], 10) * 60;
      const maxMins = parseInt(request.query.max.split(':')[1], 10);
      const totalMaxTime = maxHour + maxMins;
      if (!isNaN(totalMaxTime) && totalMaxTime>0) {
        userObj.max = totalMaxTime;
      }
    }
    if (request.query.date!=null)
      userObj.date = request.query.date;
    if (request.query.dateRange!=null)
      userObj.dateRange = request.query.dateRange;
    if (request.query.untagged!=null)
      userObj.untagged = true;
    if (request.query.date_range_checkbox!=null)
      userObj.dateRangeCheckbox = true;
    else {
      // check the tags are valid and split the user tags
      if (request.query.tags!=null && request.query.tags.search(/\S/)>=0){
        userObj.tags = request.query.tags.replace(/[^\w\s\d\;\,]+|^\s+|\s+$/g,'').split(/\s*[\,\;]\s*/g).filter(w => w.search(/\S/)>=0);
      }
    }
    if (request.query.firstIndex!=null && !isNaN(request.query.firstIndex))
      userObj.firstIndex = parseInt(request.query.firstIndex, 10);

    if (request.query.dateOrder === 'asc') {
      userObj.dateOrder = 'asc';
      userObj.string = 'Old to new';
    }
    if (!userObj.dateRangeCheckbox) {
      userObj.dateRange = '';
    }
  }
  return userObj;
};

const formatCallDuration = (duration) => {
  const hours = parseInt( duration / 3600);
  const minutes = parseInt( duration / 60 );
  const seconds = duration % 60;
  return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
};

const formatSearchDuration = (duration) => {
  const hours = parseInt( duration / 60);
  const minutes = duration % 60;
  const time = (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
  return time === '00:00' ? '' : time;
};
