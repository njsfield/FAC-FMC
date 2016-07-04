'use strict';
const tape = require('tape');
const fetchCalls = require('../../src/db/dbFetchCalls2.js');
const pg = require('pg');
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest';

const toObj = {
  filters: {
    to: 100,
    from: ''
  }
};

const fromObj = {
  filters: {
    to: '',
    from: 101
  }
};

const toAndFromObj = {
  filters: {
    to: 100,
    from: 101
  }
};

const minObj = {
  filters: {
    min: 8,
    max: ''
  }
};

const maxObj = {
  filters: {
    min: '',
    max: 9
  }
};

const minAndMaxObj = {
  filters: {
    min: 8,
    max: 9
  }
};

const dateObj = {
  filters: {
    date: '05-05-2016'
  }
};

const untaggedObj = {
  filters: {
    to: '',
    from: '',
    min: '',
    max: '',
    date: '',
    tags: ''
  }
};

tape('test fetchCalls functions', (t) => {
  t.plan(8);
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err;
    fetchCalls.toAndFromQueryStringCreator(toObj.filters, (res) => {
      const actual = res;
      const expected = 'participant_role = (\'callee\') and number = (\'100\') ';
      t.deepEqual(actual, expected, 'filtering on "to" returns the expected string');
    });
    fetchCalls.toAndFromQueryStringCreator(fromObj.filters, (res) => {
      const actual = res;
      const expected = 'participant_role = (\'caller\') and number = (\'101\') ';
      t.deepEqual(actual, expected, 'filtering on "form" returns the expected string');
    });
    fetchCalls.toAndFromQueryStringCreator(toAndFromObj.filters, (res) => {
      const actual = res;
      const expected = 'participant_role in (\'callee\', \'caller\') and number in (\'100\', \'101\')';
      t.deepEqual(actual, expected, 'filtering on "to" and "from" returns the expected string');
    });
    fetchCalls.minAndMaxQueryStringCreator(minObj.filters, (res) => {
      const actual = res;
      const expected = 'duration >= (\'8\') ';
      t.deepEqual(actual, expected, 'filtering on "min" returns the expected string');
    });
    fetchCalls.minAndMaxQueryStringCreator(maxObj.filters, (res) => {
      const actual = res;
      const expected = 'duration <= (\'9\') ';
      t.deepEqual(actual, expected, 'filtering on "max" returns the expected string');
    });
    fetchCalls.minAndMaxQueryStringCreator(minAndMaxObj.filters, (res) => {
      const actual = res;
      const expected = 'duration in (\'8\', \'9\')';
      t.deepEqual(actual, expected, 'filtering on "min" and "max" returns the expected string');
    });
    fetchCalls.dateQueryStringCreator(dateObj.filters, (res) => {
      const actual = res;
      const expected = 'date > (\'05-05-2016\') and date < (select timestamp with time zone \'epoch\' + 1462489200 * interval \'1\' second)';
      t.deepEqual(actual, expected, 'filtering on "date" returns the expected string');
    });
    fetchCalls.untaggedCallsStringCreator(untaggedObj.filters, (res) => {
      const actual = res;
      const expected = 'tag_id is NULL';
      t.deepEqual(actual, expected, 'filtering with no filters set returns the expected string to render all untagged calls');
      done();
    });
  });
});
