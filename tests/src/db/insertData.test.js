const pg = require('pg');
const test = require('../../wrapping-tape-setup.js').databaseTest;
const {insertIntoUsersTable, insertIntoTagsTable, insertIntoTagsCallsTable, insertIntoFiltersTable} = require('../../../src/db/insertData.js');

test('checking the checkTables functions', (t) => {
  t.plan(4);
  const expected = 'INSERT';

  pg.connect(process.env.POSTGRES_URL_TEST, (err, dbClient, done) => {
    insertIntoUsersTable(dbClient, obj.insertIntoUsersTable, done, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to users table');
    });
    insertIntoTagsTable(dbClient, obj.insertIntoTagsTable, done, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to tags table');
    });
    insertIntoTagsCallsTable(dbClient, obj.insertIntoTagsCallsTable, done, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to tagsCalls table');
    });
    // insertIntoFiltersTable(dbClient, obj.insertIntoFiltersTable, done, (res) => {
    //   const actual = res.command;
    //   t.deepEqual(actual, expected, 'added to filters table');
    // });
  });
});

// insertData.editTagsTable(dbClient, obj.editTagsTable, (res) => {
//   const actual = res.command;
//   const expected2 = 'UPDATE';
//   t.deepEqual(actual, expected2, 'added to tagsCalls table');
//   done();
// });

const obj = {
  insertIntoUsersTable: {
    contact_id: 239,
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
    filter_name: 'newest-test-filter',
    contact_id: 238,
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
