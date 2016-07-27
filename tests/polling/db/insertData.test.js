const pg = require('pg');
const {databaseTest} = require('../../wrapping-tape-setup.js');
const postgresURL = process.env.POSTGRES_URL_TEST;
const {insertIntoCallsTable, insertIntoCompaniesTable, insertIntoParticipantsTable, insertIntoFilesTable} = require('../../../polling/db/insertData.js');

const expected = 'INSERT';

databaseTest('test the insertData functions', (t) => {
  t.plan(4);
  pg.connect(postgresURL, (err, dbClient, done) => {
    if (err) throw err;
    insertIntoFilesTable(dbClient, obj.addToFilesTable, done, (file_id, command) => {
      const actual = command;
      t.deepEqual(actual, expected, 'added to files table');
      done();
    });
    insertIntoCallsTable(dbClient, obj.addToCallsTable, done, (res1) => {
      const actual1 = res1.command;
      t.deepEqual(actual1, expected, 'added to calls table');
      done();
    });
    insertIntoParticipantsTable(dbClient, obj.addToParticipantsTable, done, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to participants table');
      done();
    });
    insertIntoCompaniesTable(dbClient, obj.addToCompaniesTable, done, (res) => {
      const actual = res;
      t.deepEqual(actual, expected, 'added to companies table');
      done();
    });
  });
});
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
  }
};
