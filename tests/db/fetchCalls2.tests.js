'use strict';
const tape = require('tape');
const fetchCalls = require('../../src/db/dbFetchCalls2.js');

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

tape('test fetchCalls functions', (t) => {
  t.plan(1);
  const actual = fetchCalls.toAndFromQueryStringCreator(injectObj);
  const expected = [{to: 100}];
  t.deepEqual(actual, expected, 'checkFilters returns an array with 1 object');
});
