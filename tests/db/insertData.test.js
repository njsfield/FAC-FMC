const pg = require('pg');
const tape = require('tape');
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest';
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
    participant_role: 'source',
    contact_id: 12345
  }
};
const expected = 'INSERT';

tape('test the insertData functions', (t) => {
  t.plan(5);
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err;
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
    insertData.addToCallsTable(client, obj.addToCallsTable, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to calls table');
      done();
    });
    insertData.addToUsersTable(client, obj.addToUsersTable, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to users table');
      done();
    });
    insertData.addToParticipantsTable(client, obj.addToParticipantsTable, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to participants table');
      done();
    });
    pg.end();
  });
});
