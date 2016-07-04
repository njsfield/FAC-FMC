'use strict';
const tape = require('tape');
const fetchCalls = require('../../src/db/dbFetchCalls2.js');
const pg = require('pg');
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest';

const injectObj = {
  company_id: 101,
  contact_id: 4387735,
  filters: {
    to: 100,
    from: '',
    min: '',
    max: '',
    date: '',
    tags: ''
  }
};

const filters = injectObj.filters;

tape('test fetchCalls functions', (t) => {
  t.plan(1);
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err;
    const actual = fetchCalls.toAndFromQueryStringCreator(filters);
    console.log(actual, '<---- actual');
    t.deepEqual(actual, expected, 'checkFilters returns an array with 1 object');
    done();
  });
});

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
