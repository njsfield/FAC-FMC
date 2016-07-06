'use strict';
const tape = require('tape');
const fetchCalls = require('../../../src/db/filterQueryStringCreator.js');
const pg = require('pg');
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest';
const queryString = 'select date, file_id, contact_id, participant_role, number, internal, duration, tag_id from participants p inner join calls c on p.call_id = c.call_id and p.company_id = ($1) and p.contact_id = ($2) left join tags_calls t on c.call_id = t.call_id where ';

const toObj = {
  to: 100,
  from: ''
};

const fromObj = {
  to: '',
  from: 101
};

const toAndFromObj = {
  to: 100,
  from: 101
};

const minObj = {
  min: 8,
  max: ''
};

const maxObj = {
  min: '',
  max: 9
};

const minAndMaxObj = {
  min: 8,
  max: 9
};

const dateObj = {
  date: '05-05-2016'
};

const untaggedObj = {
  to: '',
  from: '',
  min: '',
  max: '',
  date: '',
  tags: ''

};

const userObj = {
  to: 8,
  from: '',
  min: '',
  max: '',
  date: '',
  tags: ''
};

tape('test fetchCalls functions', (t) => {
  t.plan(10);
  fetchCalls.toAndFromQueryStringCreator(toObj, (res) => {
    const actual = res;
    const expected = 'participant_role = (\'callee\') and number = (\'100\') ';
    t.deepEqual(actual, expected, 'filtering on "to" returns the expected string');
  });
  fetchCalls.toAndFromQueryStringCreator(fromObj, (res) => {
    const actual = res;
    const expected = 'participant_role = (\'caller\') and number = (\'101\') ';
    t.deepEqual(actual, expected, 'filtering on "form" returns the expected string');
  });
  fetchCalls.toAndFromQueryStringCreator(toAndFromObj, (res) => {
    const actual = res;
    const expected = 'participant_role in (\'callee\', \'caller\') and number in (\'100\', \'101\')';
    t.deepEqual(actual, expected, 'filtering on "to" and "from" returns the expected string');
  });
  fetchCalls.minAndMaxQueryStringCreator(minObj, (res) => {
    const actual = res;
    const expected = 'duration >= (\'8\') ';
    t.deepEqual(actual, expected, 'filtering on "min" returns the expected string');
  });
  fetchCalls.minAndMaxQueryStringCreator(maxObj, (res) => {
    const actual = res;
    const expected = 'duration <= (\'9\') ';
    t.deepEqual(actual, expected, 'filtering on "max" returns the expected string');
  });
  fetchCalls.minAndMaxQueryStringCreator(minAndMaxObj, (res) => {
    const actual = res;
    const expected = 'duration in (\'8\', \'9\')';
    t.deepEqual(actual, expected, 'filtering on "min" and "max" returns the expected string');
  });
  fetchCalls.dateQueryStringCreator(dateObj, (res) => {
    const actual = res;
    const expected = 'date > (\'05-05-2016\') and date < (select timestamp with time zone \'epoch\' + 1462489200 * interval \'1\' second)';
    t.deepEqual(actual, expected, 'filtering on "date" returns the expected string');
  });
  fetchCalls.untaggedCallsStringCreator(untaggedObj, (res) => {
    const actual = res;
    const expected = 'tag_id is NULL';
    t.deepEqual(actual, expected, 'filtering with no filters set returns the expected string to render all untagged calls');
  });
  fetchCalls.createQueryString(queryString, userObj, (res) => {
    console.log(res);
    const actual = res;
    const expected = 'select date, file_id, contact_id, participant_role, number, internal, duration, tag_id from participants p inner join calls c on p.call_id = c.call_id and p.company_id = ($1) and p.contact_id = ($2) left join tags_calls t on c.call_id = t.call_id where participant_role = (\'callee\') and number = (\'8\') ';
    t.deepEqual(actual, expected, 'complete query string is as expected');
  });
  pg.connect(postgresURL, (error, dbClient) => {
    if (error) throw error;
    fetchCalls.createQueryString(queryString, userObj, (qString) => {
      dbClient.query(qString, [100, 4387735], (err, res) => {
        const actual = res.rowCount;
        const expected = 1;
        t.deepEqual(actual, expected, 'tests that correct data is returned from the joining of the tables');
      });
    });
  });
});
