'use strict';

const pg = require('pg');
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc';
const startOfJoinString = 'select date, file_id, contact_id, participant_role, number, internal, duration from participants inner join calls on participants.call_id = calls.call_id and participants.company_id = calls.company_id where ';

const injectObj = {
  company_id: 101,
  contact_id: 4387735,
  filters: {
    to: 239 ,
    from: 238,
    min: '',
    max: '',
    date: '',
    tags: ''
  }
};

const filters = injectObj.filters;

var queryString = '';
var fromAndTo = 'participant_role in (\'callee\', \'caller\') and number in (\'';
// var callsToString = 'participant_role = (\'callee\') and number = (\'';
// var callsFromString = 'participant_role = (\'caller\') and number = (\'';
// var minTimeString = 'and duration >= (\'';
// var maxTimeString = 'and duration <= (\'';
// var dateString = 'date > (\'2016-06-15\') and date < (\'2016-06-16\')';

var arr = [];
const queryStringCreator = (obj) => {
  queryString += startOfJoinString;
  if (obj.to !== '' && obj.from !== '') {
    queryString += `${fromAndTo}${obj.to}\', \'${obj.from}\')`;
  }
  // if (obj.to !== '') {
  //   obj.to += '\') ';
  //   callsToString += obj.to;
  //   arr.push(callsToString);
  // }
  // if (obj.from !== '') {
  //   obj.from += '\') ';
  //   callsFromString += obj.from;
  //   queryString += callsFromString;
  // }
  // if (obj.min !== '') {
  //   obj.min += '\') ';
  //   minTimeString += obj.min;
  //   queryString += minTimeString;
  // }
  // if (obj.max !== '') {
  //   obj.max += '\') ';
  //   maxTimeString += obj.max;
  //   queryString += maxTimeString;
  // }
  // if (obj.date !== '') {
  //   // obj.date += '\') ';
  //   // dateString += obj.date;
  //   queryString += dateString;
  // }
  return (queryString);
};

queryStringCreator(filters);
console.log(queryString, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');

pg.connect(postgresURL, (err, dbClient) => {
  if (err) throw err;
  dbClient.query(queryString, (error, response) => {
    if (error) throw error;
    console.log(response.rows, '<<<<<<<<<<<<<<RESPONSE');
  });
});
// if (injectObj.filters.to !== '') {
//
// }

/** Check filters object for blank fields. */
//
// const response =   {
//     call_id: '104',
//     company_id: '100',
//     participants: {
//       destination: {
//         internal: true,
//         number: '8',
//         user: true
//       },
//       source: {
//         internal: false,
//         number: '7',
//         user: false
//       }
//     },
//     duration: '2016-01-07 12:43:35',
//     time: '345678904',
//     file_id: '3',
//   }

// const checkFilters = (injectObj) => {
//   const filters = injectObj.filters;
//
//   if (filters.to !== '') {
//
//   }
// };
//
// module.exports = {
//   checkFilters
// };
