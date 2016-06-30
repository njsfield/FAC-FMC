'use strict';

const pg = require('pg');
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc';

const injectObj = {
  company_id: 101,
  contact_id: 4387735,
  filters: {
    to: 241 ,
    from: '',
    min: '',
    max: '',
    date: '',
    tags: ''
  }
};

const filters = injectObj.filters;

const startOfJoinString = 'select date, file_id, contact_id, participant_role, number, internal, duration from participants inner join calls on participants.call_id = calls.call_id and participants.company_id = calls.company_id where ';
var callsToString = 'participant_role = callee and number = ';
var queryString = '';
// const callsFromString = 'participant_role = caller and number =';
// const minTimeString = 'duration >=';
// const maxTimeString = 'duration <=';
// const dateString = `date > ${variable} and date < ${variable}+1day`;

const queryStringCreator = (filtersObj) => {
  queryString += startOfJoinString;
  if (filtersObj.to !== '') {
    callsToString += filters.to;
    queryString += callsToString;
  }
  return (queryString);
};

queryStringCreator(filters);

pg.connect(postgresURL, (err, dbClient, done) => {
  if (err) throw err;
  dbClient.query('select date, file_id, contact_id, participant_role, number, internal, duration from participants inner join calls on participants.call_id = calls.call_id and participants.company_id = calls.company_id where participant_role =(\'callee\') and number =(\'241\')', (error, response) => {
    if (error) throw error;
    console.log(response, '<<<<<<<<<<<<<<RESPONSE');
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
