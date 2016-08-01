const pg = require('pg');
const test = require('../../wrapping-tape-setup.js').databaseTest;
const {checkUsersTable, checkTagsTable, checkFiltersTable} = require('../../../src/db/checkTables.js');

const expectedSelect = 'SELECT';
const expectedInsert = 'INSERT';

test('checking the checkTables functions', (t) => {
  t.plan(6);
  pg.connect(process.env.POSTGRES_URL_TEST, (err, dbClient, done) => {
    if (err) throw err;
    checkUsersTable(dbClient, dataObj.usersT, done, (err1, res) => {
      const actual = res.command;
      t.deepEqual(actual, expectedSelect, 'user exists in users table');
    });
    checkUsersTable(dbClient, newDataObj.usersT, done, (err1, res) => {
      const actual = res.command;
      t.deepEqual(actual, expectedInsert, 'user inserted into users table');
    });
    checkTagsTable(dbClient, dataObj.tagsT, done, (err1, res) => {
      const actual = res.command;
      t.deepEqual(actual, expectedSelect, 'tag exists in tags table');
    });
    checkTagsTable(dbClient, newDataObj.tagsT, done, (err1, res) => {
      const actual = res.command;
      t.deepEqual(actual, expectedInsert, 'new data added to tags table');
      done();
    });
    checkFiltersTable(dbClient, dataObj.filtersT, done, (err1, res) => {
      const actual = res.message;
      const expected = 'filter name already exists';
      t.deepEqual(actual, expected, 'filter exists in filters table');
    });
    checkFiltersTable(dbClient, newDataObj.filtersT, done, (err1, res) => {
      const actual = res.success;
      const expected = true;
      t.deepEqual(actual, expected, 'new filter added to filters table');
      done();
    });
  });
});

const dataObj = {
  usersT: {
    contact_id: 100
  },
  tagsT: {
    tag_name: 'urgent',
    company_id: 100
  },
  participantsT: {
    company_id: 100,
    call_id: 100,
    contact_id: 3222,
    internal: true,
    number: 100,
    participant_role: 'callee'
  },
  filtersT: {
    filter_name: 'test-filter',
    contact_id: 100
  }
};

const newDataObj = {
  usersT: {
    contact_id: 101,
    company_id: 100
  },
  tagsT: {
    tag_name: 'important',
    company_id: 100
  },
  participantsT: {
    company_id: 100,
    call_id: 100,
    contact_id: 3222,
    internal: true,
    number: 100,
    participant_role: 'callee'
  },
  filtersT: {
    filter_name: 'newest-test-filter',
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
