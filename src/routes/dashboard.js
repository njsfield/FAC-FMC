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

      console.log("PROCESSING FILTER REQUEST", userObj);
//includeHidden
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
              const qArray = [];

              var qString = filterQueryStringCreator.createQueryString(qArray, userObj, userObj.dateOrder);

              dbClient.query(qString, qArray, (err2, res) => {
                console.log('QUERY STRING: '+qString);
                console.log('PARAMS STRING: '+qArray);
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
                      getTagNames(dbClient, decoded, 10, (err4, savedTags) => {
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
                          console.log('ROWS RETURNED: ',res.rows);
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

function parseDate(date) {
  // The date MUST be in the form YYYY-MM-DD (not sure this is ideal!). For flexibility also process
  // as follows:
  //   if there is only one part to the date then any time in that year
  //   if there are two parts to the date then any time in that month
  //   if there are three parts then this will be the full date
  // This method returns: [dateFrom, dateTo]. dateFrom and dateTo will be the same
  // if a full date (three parts) is specified then dateFrom will be midnight of the date specifified and
  // dateTo will be midnight on the following day. If the format of the date is not recognised then
  // null is returned.
  //
  // The return items are both date objects.
  var res, date1, date2, fmt;
  if (date!=null) {
    // Split using a regexp.
    var pt = (/^\s*(\d{2,4})(\-\d{1,2})?(\-\d{1,2})?\s*$/).exec(date);
    console.log('PARSING "'+date+'" YIELDS: ',pt);
    if (pt!=null) {
      console.log('PT.LENGTH: ['+pt.length+']');
      if (pt[2]==null) {
        // It's a year
        date1 = new Date(parseInt(pt[1],10),0,1,0,0,0);
        date2 = new Date(parseInt(pt[1],10)+1,0,1,0,0,0);
        // And generate the correct format output.
        fmt = date1.getFullYear();
      }
      else if (pt[3]==null) {
        // It's a month
        date1 = new Date(parseInt(pt[1],10),(-parseInt(pt[2],10))-1,1,0,0);
        date2 = new Date(parseInt(pt[1],10),(-parseInt(pt[2],10)),1,0,0);
        fmt = date1.getFullYear()+'-'+('0'+(date1.getMonth()+1)).substr(-2);
      }
      else if (pt.length==4) {
        // Full date - all parts included.
        date1 = new Date(parseInt(pt[1],10),(-parseInt(pt[2],10))-1,-parseInt(pt[3],10),0,0);
        date2 = new Date(parseInt(pt[1],10),(-parseInt(pt[2],10))-1,-parseInt(pt[3],10)+1,0,0);
        fmt = date1.getFullYear()+'-'+('0'+(date1.getMonth()+1)).substr(-2)+'-'+('0'+date1.getDate()).substr(-2);
      }
      // What ever end date we selected we want to move to 1 second before midmight on the day before.
      date2 = new Date(date2.valueOf()-1000); // Should be 1 second before midnight on the previous day.

      res = [date1, date2, fmt];
    }
  }
  console.log("DATE PROCESSING: ",res);
  return res;
}
const formatUserObj = (request, user)=> {
  let isAdmin = (user.userRole==='admin');

  // 'isManager' is not currently supported but will be used when we implement a
  // manager authentication level and will be true if the person logged in can see
  // the calls of other people for which they have authority.
  let isManager = false;
  let userObj = {
    isAdmin: isAdmin,
    isManager: isManager,
    isIndividual: (!isAdmin && !isManager),
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
    contactID: user.contact_id,
    dateOrder: 'desc',
    dateSortString: 'new to old',
    includeHidden: false
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
      userObj.includeHidden = true;
    }
    else {
      // *NOT* an administrator so either a manager or a 'standard' user
      userObj.includeHidden = (isManager || (request.query.include_hidden=='yes'));
    }
    if (request.query.to!=null && request.query.to.search(/\S/)>=0)
      userObj.to = request.query.to;
    if (request.query.from!=null && request.query.from.search(/\S/)>=0)
      userObj.from = request.query.from;
    if (request.query.min!=null) {
      if (request.query.min.indexOf(':') !== -1) {
        const minHour = parseInt(request.query.min.split(':')[0], 10) * 60;
        const minMins = parseInt(request.query.min.split(':')[1], 10);
        const totalMinTime = minHour + minMins;
        if (!isNaN(totalMinTime) && totalMinTime>0) {
          userObj.min = totalMinTime;
        }
      }
      else {
        // Treat it as anumber (expect *ONLY* a number) and this is taken as minutes (allow float so seconds also allowed).
        const minMins = parseInt(request.query.min, 10);
        if (!isNaN(minMins))
          userObj.min = minMins;
      }
    }
    if (request.query.max!=null) {
      if (request.query.max.indexOf(':') !== -1) {
        const maxHour = parseInt(request.query.max.split(':')[0], 10) * 60;
        const maxMins = parseInt(request.query.max.split(':')[1], 10);
        const totalMaxTime = maxHour + maxMins;
        if (!isNaN(totalMaxTime) && totalMaxTime>0) {
          userObj.max = totalMaxTime;
        }
      }
      else {
        const maxMins = parseInt(request.query.max, 10);
        if (!isNaN(maxMins))
          userObj.max = maxMins;
      }
    }
    var startDates, endDates;
    if (request.query.date!=null) {
      // Start date specified - get the range
      startDates = parseDate(request.query.date);
    }
    if (startDates!=null && request.query.dateRange!=null) {
      // And an end date
      endDates = parseDate(request.query.dateRange);
      // If the dates in start and end are the same then we have an implied range.
      if (endDates!=null) {
        if (startDates[0]==endDates[0] && startDates[1]==endDates[1])
          endDates = null;
      }
    }
    // If we have BOTH a stard and end date specified then check we have them in the right order.
    if (startDates!=null && endDates!=null) {
      // Check order
      if (+endDates[0] < +startDates[0]) {
        // Swap the order
        [startDates, endDates] = [endDates, startDates];
      }
      // Make sure we choose the widest range.
      if (+endDates[0] < +startDates[0]) startDates[0] = endDates[0];
      // if (+endDates[1] < +startDates[1] > ) endDates[1] = startDates[1];
    }
    if (startDates!=null) {
      userObj.startDate = startDates[0];
      userObj.endDate = startDates[1];
      if (endDates!=null)
        userObj.endDate = endDates[1];

      // Will have both a start and end date, if they are the same then delete the end date from the test.
      if (userObj.startDate.getFullYear() == userObj.endDate.getFullYear() &&
          userObj.startDate.getMonth() == userObj.endDate.getMonth() &&
          userObj.startDate.getDate() == userObj.endDate.getDate()) {
        // Start and end of the range are the same so we don't want an end date.
        delete userObj.endDate;
      }
    }
    // Now text format the dates so they appear correctly on the clients form.
    if (userObj.startDate!=null)
      userObj.date = startDates[2];
    if (endDates!=null && userObj.endDate!=null)
      userObj.dateRange = endDates[2];

    userObj.dateRangeCheckbox = (endDates!=null);

    userObj.untagged = (request.query.untagged!=null);

    if (!userObj.untagged && request.query.tags!=null && request.query.tags.search(/\S/)>=0){
      // check the tags are valid and split the user tags
      userObj.tags = request.query.tags
        .replace(/[^\w\s\d\;\,]+|^\s+|\s+$/g,'')
        .toLowerCase()
        .split(/\s*[\,\;]\s*/g)
        .filter(w => w.search(/\S/)>=0);
    }
    if (request.query.firstIndex!=null && !isNaN(request.query.firstIndex))
      userObj.firstIndex = parseInt(request.query.firstIndex, 10);

    if (request.query.dateOrder === 'asc') {
      userObj.dateOrder = 'asc';
      userObj.dateSortString = 'old to new';
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
