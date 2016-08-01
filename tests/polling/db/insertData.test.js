const pg = require('pg');
const {databaseTest} = require('../../wrapping-tape-setup.js');
const postgresURL = process.env.POSTGRES_URL_TEST;
const {insertIntoCallsTable, insertIntoCompaniesTable, insertIntoParticipantsTable, insertIntoFilesTable} = require('../../../polling/db/insertData.js');

const expected = 'INSERT';

databaseTest('test the insertData functions', (t) => {
  t.plan(6);
  pg.connect(postgresURL, (err, dbClient, done) => {
    if (err) throw err;
    insertIntoFilesTable(dbClient, obj.addToFilesTable, done, (err1, file_id, command) => {
      const actual = command;
      t.deepEqual(actual, expected, 'added to files table');
      done();
    });
    insertIntoCallsTable(dbClient, obj.addToCallsTable, done, (err1, res1) => {
      const actual1 = res1.command;
      t.deepEqual(actual1, expected, 'added to calls table');
      done();
    });
    insertIntoCallsTable(dbClient, obj.addToCallsTable1, done, (err1, res1) => {
      const actual1 = res1.command;
      t.deepEqual(actual1, expected, 'added to calls table');
      done();
    });
    insertIntoParticipantsTable(dbClient, obj.addToParticipantsTable, done, (err1, res) => {
      console.log('err', err1);
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to participants table');
      done();
    });
    insertIntoParticipantsTable(dbClient, obj.addToParticipantsTable1, done, (err1, res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'added to participants table');
      done();
    });
    insertIntoCompaniesTable(dbClient, obj.addToCompaniesTable, done, (err1, res) => {
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
  addToCallsTable1: {
    company_id: 100,
    file_id: 101,
    date: 1490614566,
    duration: 999
  },
  addToParticipantsTable: {
    call_id: 100,
    company_id: 100,
    number: 1,
    internal: false,
    participant_role: 'caller',
  },
  addToParticipantsTable1: {
    call_id: 151,
    company_id: 100,
    number: 1,
    internal: false,
    participant_role: 'caller',
  }
};
