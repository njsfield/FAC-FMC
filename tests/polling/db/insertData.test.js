const pg = require('pg');
const tape = require('tape');
const postgresURL = process.env.POSTGRES_URL_TEST;
const {insertIntoCallsTable, insertIntoParticipantsTable, insertIntoFilesTable} = require('../../../polling/db/insertData.js');

const obj = {
  addToCompaniesTable: {
    company_name: 'new_company'
  },
  addToFilesTable: {
    file_name: 'new_file'
  },
  addToCallsTable: {
    company_id: 100,
    file_id: 100,
    date: 1466339061,
    duration: 999
  },
  addToUsersTable: {
    contact_id: 239,
    company_id: 100
  },
  addToParticipantsTable: {
    call_id: 100,
    company_id: 100,
    number: 1,
    internal: false,
    participant_role: 'caller',
    contact_id: 12345
  },
  addToTagsTable: {
    company_id: 100,
    tag_name: 'urgent'
  },
  addToTagsCallsTable: {
    call_id: 101,
    tag_id: 100
  },
  addToFiltersTable: {
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
  // editTagsTable: {
  //   tag_id: 100,
  //   tag_name: 'important'
  // }
};
const expected = 'INSERT';

tape('test the insertData functions', (t) => {
  t.plan(8);
  pg.connect(postgresURL, (err, dbClient, done) => {
    if (err) throw err;
    insertIntoCallsTable(dbClient, obj.addToCallsTable, done, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to calls table');
      done();
    });
    insertIntoParticipantsTable(dbClient, obj.addToParticipantsTable, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to participants table');
      done();
    });
    insertData.addToCompaniesTable(dbClient, obj.addToCompaniesTable, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to companies table');
      done();
    });
    insertData.addToFilesTable(dbClient, obj.addToFilesTable, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to files table');
      done();
    });
    
    // insertData.editTagsTable(dbClient, obj.editTagsTable, (res) => {
    //   const actual = res.command;
    //   const expected2 = 'UPDATE';
    //   t.deepEqual(actual, expected2, 'added to tagsCalls table');
    //   done();
    // });
  });
});
