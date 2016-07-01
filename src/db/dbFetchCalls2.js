'use strict';

const pg = require('pg');
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc';
var queryString = 'select date, file_id, contact_id, participant_role, number, internal, duration from participants inner join calls on participants.call_id = calls.call_id and participants.company_id = calls.company_id where ';

/** joins tags_calls, calls, participants but no data in tags_calls means response is empty */
// var tagsQueryString = 'select date, file_id, contact_id, participant_role, number, internal, duration, tag_id from participants p inner join calls c on p.call_id = c.call_id and p.company_id = c.company_id inner join tags_calls t on c.call_id = t.call_id where ';

const injectObj = {
  company_id: 101,
  contact_id: 4387735,
  filters: {
    to: 239,
    from: '',
    min: '',
    max: '',
    date: '',
    tags: ''
  }
};

const filters = injectObj.filters;

var queryArr = [];
// var queryString = '';
var fromAndTo = 'participant_role in (\'callee\', \'caller\') and number in (\'';
var minAndMax = 'duration in (\'';

var callsToString = 'participant_role = (\'callee\') and number = (\'';
var callsFromString = 'participant_role = (\'caller\') and number = (\'';
var minTimeString = 'duration >= (\'';
var maxTimeString = 'duration <= (\'';
var dateString = 'date > (\'';
var datePlusOneString = 'date < (select timestamp with time zone \'epoch\' + ';
var datePlusOneStringEnd = ' * interval \'1\' second)';
var untaggedCalls = 'tag_id = null';

const toAndFromQueryStringCreator = (obj) => {
  if (obj.to !== '' && obj.from !== '') {
    queryArr.push(`${fromAndTo}${obj.to}\', \'${obj.from}\')`);
  }
  else if (obj.to !== '') {
    obj.to += '\') ';
    callsToString += obj.to;
    queryArr.push(callsToString);
  }
  else if (obj.from !== '') {
    obj.from += '\') ';
    callsFromString += obj.from;
    queryArr.push(callsFromString);
  }
};

const minAndMaxQueryStringCreator = (obj) => {
  if (obj.min !== '' && obj.max !== '') {
    queryArr.push(`${minAndMax}${obj.min}\', \'${obj.max}\')`);
  }
  else if (obj.min !== '') {
    obj.min += '\') ';
    minTimeString += obj.min;
    queryArr.push(minTimeString);
  }
  else if (obj.max !== '') {
    obj.max += '\') ';
    maxTimeString += obj.max;
    queryArr.push(maxTimeString);
  }
};

const dateQueryStringCreator = (obj) => {
  const dateMillis = new Date(obj.date).getTime() + 86400000;
  if (obj.date !== '') {
    obj.date += '\') ';
    queryArr.push(dateString += obj.date);
    queryArr.push(datePlusOneString + dateMillis + datePlusOneStringEnd);
  }
};

/** still to be properly hooked up to the untagged calls section */
// const untaggedCallsStringCreator = (obj) => {
//   if (obj.to === '' && obj.from === '' && obj.min === '' && obj.max === '' && obj.date === '' && obj.tags === '') {
//     queryString += untaggedCalls;
//   }
// };

// untaggedCallsStringCreator(filters);
toAndFromQueryStringCreator(filters);
dateQueryStringCreator(filters);
minAndMaxQueryStringCreator(filters);

queryString += queryArr.join(' and ');

console.log(queryString, '<--- querystring');
//
pg.connect(postgresURL, (err, dbClient) => {
  if (err) throw err;
  dbClient.query(queryString, (error, response) => {
    if (error) throw error;
    console.log(response.rows, '<<<<<<<<<<<<<<RESPONSE');
  });
});
