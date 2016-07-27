'use strict';
const test = require('../../wrapping-tape-setup.js').databaseTest;
const QSCreator = require('../../../src/db/filterQueryStringCreator.js');
const queryString = `SELECT calls.*,
   participants1.participant_id AS caller_id, participants1.internal AS caller_internal, participants1.number AS caller_number, participants1.contact_id AS caller_contact,
   participants2.participant_id AS callee_id, participants2.internal AS callee_internal, participants2.number AS callee_number, participants2.contact_id AS callee_contact,
   array(select tag_name from tags where tag_id in (select tag_id from tags_calls where tags_calls.call_id = calls.call_id)) AS tag_name
FROM calls
    LEFT JOIN participants participants1 ON calls.call_id = participants1.call_id AND participants1.participant_role = 'caller'
    LEFT JOIN participants participants2 ON calls.call_id = participants2.call_id AND participants2.participant_role = 'callee'
WHERE (participants1.contact_id=$1 OR participants2.contact_id=$1) AND calls.company_id=$2 `;

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

const userObj = {
  to: '',
  from: '',
  min: '',
  max: '',
  date: '',
  tags: [],
  untagged: false,
  firstIndex: 0,
  maxRows: 20
};

test('test QSCreator functions', (t) => {
  t.plan(8);
  QSCreator.toAndFromQueryStringCreator(toObj, [], (res) => {
    const actual = res;
    const expected = [100];
    t.deepEqual(actual, expected, 'filtering on "to" returns the expected string');
  });
  QSCreator.toAndFromQueryStringCreator(fromObj, [], (res) => {
    const actual = res;
    const expected = [101];
    t.deepEqual(actual, expected, 'filtering on "form" returns the expected string');
  });
  QSCreator.toAndFromQueryStringCreator(toAndFromObj, [], (res) => {
    const actual = res;
    const expected = [100, 101];
    t.deepEqual(actual, expected, 'filtering on "to" and "from" returns the expected string');
  });
  QSCreator.minAndMaxQueryStringCreator(minObj, [], (res) => {
    const actual = res;
    const expected = [8];
    t.deepEqual(actual, expected, 'filtering on "min" returns the expected string');
  });
  QSCreator.minAndMaxQueryStringCreator(maxObj, [], (res) => {
    const actual = res;
    const expected = [9];
    t.deepEqual(actual, expected, 'filtering on "max" returns the expected string');
  });
  QSCreator.minAndMaxQueryStringCreator(minAndMaxObj, [], (res) => {
    const actual = res;
    const expected = [8, 9];
    t.deepEqual(actual, expected, 'filtering on "min" and "max" returns the expected string');
  });
  QSCreator.dateQueryStringCreator(dateObj, [], (res) => {
    const actual = res;
    const expected = ['05-05-2016'];
    t.deepEqual(actual, expected, 'filtering on "date" returns the expected string');
  });
  QSCreator.createQueryString(queryString, ['value1', 'value2'], userObj, (createdQueryString) => {
    const actual = createdQueryString.indexOf('LIMIT $3') > -1;
    const expected = true;
    t.deepEqual(actual, expected, 'complete query string is as expected');
  });
});
