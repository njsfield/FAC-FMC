'use strict';

var fromAndTo = 'participant_role in (\'callee\', \'caller\') and number in (\'';
var minAndMax = 'duration in (\'';
var callsToString = 'participant_role = (\'callee\') and number = (\'';
var callsFromString = 'participant_role = (\'caller\') and number = (\'';
var minTimeString = 'duration >= (\'';
var maxTimeString = 'duration <= (\'';
var dateString = 'date > (\'';
var datePlusOneString = 'and date < (select timestamp with time zone \'epoch\' + ';
var datePlusOneStringEnd = ' * interval \'1\' second)';
var untaggedCalls = 'tag_id is NULL';

/** Reference notes for super function */
// var queryString = 'select date, file_id, contact_id, participant_role, number, internal, duration, tag_id from participants p inner join calls c on p.call_id = c.call_id and p.company_id = c.company_id left join tags_calls t on c.call_id = t.call_id where ';
// var queryArr = [];
// queryString += queryArr.join(' and ');
// console.log(queryString, '<--- querystring');
// pg.connect(postgresURL, (err, dbClient) => {
//   if (err) throw err;
//   dbClient.query(queryString, (error, response) => {
//     if (error) throw error;
//     console.log(response.rows[0], '<<<ROWCOUNT');
//     return response;
//   });
// });

const toAndFromQueryStringCreator = (obj, callback) => {
  if (obj.to !== '' && obj.from !== '') {
    callback(`${fromAndTo}${obj.to}\', \'${obj.from}\')`);
  }
  else if (obj.to !== '') {
    obj.to += '\') ';
    callsToString += obj.to;
    callback(callsToString);
  }
  else if (obj.from !== '') {
    obj.from += '\') ';
    callsFromString += obj.from;
    callback(callsFromString);
  }
};

const minAndMaxQueryStringCreator = (obj, callback) => {
  if (obj.min !== '' && obj.max !== '') {
    callback(`${minAndMax}${obj.min}\', \'${obj.max}\')`);
  }
  else if (obj.min !== '') {
    obj.min += '\') ';
    minTimeString += obj.min;
    callback(minTimeString);
  }
  else if (obj.max !== '') {
    obj.max += '\') ';
    maxTimeString += obj.max;
    callback(maxTimeString);
  }
};

const dateQueryStringCreator = (obj, callback) => {
  const dateMillis = (new Date(obj.date).getTime() + 86400000)/1000;
  if (obj.date !== '') {
    obj.date += '\') ';
    callback(dateString += obj.date + datePlusOneString + dateMillis + datePlusOneStringEnd);
  }
};

const untaggedCallsStringCreator = (obj, callback) => {
  if (obj.to === '' && obj.from === '' && obj.min === '' && obj.max === '' && obj.date === '' && obj.tags === '') {
    callback(untaggedCalls);
  }
};

module.exports = {
  toAndFromQueryStringCreator,
  minAndMaxQueryStringCreator,
  dateQueryStringCreator,
  untaggedCallsStringCreator
};
