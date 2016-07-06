const pg = require('pg');
const tape = require('tape');
const postgresURL = process.env.POSTGRES_URL_TEST;
const insertData = require('../../polling/dbFunctions/insertData.js');
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
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err;
    insertData.addToCallsTable(client, obj.addToCallsTable, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to calls table');
      done();
    });
    insertData.addToParticipantsTable(client, obj.addToParticipantsTable, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to participants table');
      done();
    });
    insertData.addToCompaniesTable(client, obj.addToCompaniesTable, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to companies table');
      done();
    });
    insertData.addToFilesTable(client, obj.addToFilesTable, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to files table');
      done();
    });
    insertData.addToUsersTable(client, obj.addToUsersTable, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to users table');
      done();
    });
    insertData.addToTagsTable(client, obj.addToTagsTable, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to tags table');
      done();
    });
    insertData.addToTagsCallsTable(client, obj.addToTagsCallsTable, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to tagsCalls table');
      done();
    });
    insertData.addToFiltersTable(client, obj.addToFiltersTable, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to filters table');
      done();
      // pg.end();
    });
    // insertData.editTagsTable(client, obj.editTagsTable, (res) => {
    //   const actual = res.command;
    //   const expected2 = 'UPDATE';
    //   t.deepEqual(actual, expected2, 'added to tagsCalls table');
    //   done();
    // });
  });
});
