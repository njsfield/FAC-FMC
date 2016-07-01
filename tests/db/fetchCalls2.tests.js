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
