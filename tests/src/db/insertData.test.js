const pg = require('pg');
const test = require('../../wrapping-tape-setup.js').databaseTest;
const {insertIntoUsersTable, insertIntoTagsTable, insertIntoTagsCallsTable, insertIntoFiltersTable} = require('../../../src/db/insertData.js');

test('checking the checkTables functions', (t) => {
  t.plan(4);
  const expected = 'INSERT';

  pg.connect(process.env.POSTGRES_URL_TEST, (err, dbClient, done) => {
    insertIntoUsersTable(dbClient, obj.insertIntoUsersTable, done, (err1, res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to users table');
    });
    insertIntoTagsTable(dbClient, obj.insertIntoTagsTable, done, (err1, res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to tags table');
    });
    insertIntoTagsCallsTable(dbClient, obj.insertIntoTagsCallsTable, done, (err1, res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to tagsCalls table');
    });
    insertIntoFiltersTable(dbClient, obj.insertIntoFiltersTable, done, (err1, res) => {
      const actual = res.success;
      t.deepEqual(actual, true, 'added to filters table');
    });
  });
});

const obj = {
  insertIntoUsersTable: {
    contact_id: 100,
    company_id: 100
  },
  insertIntoTagsTable: {
    company_id: 100,
    tag_name: 'urgent'
  },
  insertIntoTagsCallsTable: {
    call_id: 150,
    tag_id: 100
  },
  insertIntoFiltersTable: {
    filter_name: 'test-filter',
    contact_id: 100,
    filter_spec: {
      to: 100,
      from: '',
      min: '',
      max: '',
      date: '',
      tags: ''
    }
  }
};
