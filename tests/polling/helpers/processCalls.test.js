const {processCalls} = require('../../../polling/helpers/processCalls.js');
const {databaseTest} = require('../../wrapping-tape-setup.js');
const {checkFilesTable, checkCallsTable, checkParticipantsTable} = require('../../../polling/db/checkTables.js');
const pg = require('pg');
const postgresURL = process.env.POSTGRES_URL_TEST;

const arrOfCalls = [
  {
    caller: '317',
    callee: '223',
    duration: '3',
    date: new Date()/1000,
    company: 'default',
    file_name: '2016.07.08.16.25.20-1467991520-226-230.wav'
  }
];

const arrOfCalls2 = [
  {
    caller: '317',
    callee: '223',
    date: new Date()/1000,
    company_id: 100,
    duration: '3',
    file_id: 200,
    company: 'default',
    file_name: '2016.07.08.16.25.20-1467991520-226-230.wav'
  }
];
const participantsArray = [];

const participantsObj = {
  company_id: 100,
  call_id: 200,
  internal: true,
  number: 223,
  participant_role: 'callee'
};
const participantsObj1 = {
  company_id: 100,
  call_id: 200,
  internal: true,
  number: 317,
  participant_role: 'caller'
};
databaseTest('run processCalls for 1 call and check whether the tables have been filled', (t) => {
  t.plan(5);
  pg.connect(postgresURL, (err, dbClient, done) => {
    processCalls(dbClient, done, 'default', companiesObj, arrOfCalls, participantsArray, (err1, response) => {
      const actual = response;
      const expected = 'success';
      t.equals(actual, expected, 'calls have been processed');
    });
    checkFilesTable(dbClient, arrOfCalls2[0], done, (err1, res) => {
      const actual = res;
      const file_id = '200';
      t.deepEqual(actual, file_id, 'file has been put in the file table');
      done();
    });
    checkCallsTable(dbClient, arrOfCalls2[0], done, (err1, res) => {
      const actual = res;
      const call_id = '200';
      t.deepEqual(actual, call_id, 'call has been put in calls table');
      done();
    });
    checkParticipantsTable(dbClient, participantsObj, done, (err1, res) => {
      const actual = res;
      const expected = 223;
      t.deepEqual(actual, expected, 'participants added in participants table');
      done();
    });
    checkParticipantsTable(dbClient, participantsObj1, done, (err1, res) => {
      const actual = res;
      const expected = 317;
      t.deepEqual(actual, expected, 'participants added in participants table');
      done();
    });
  });
});

const companiesObj = {
  'default': {
    company_id: '100'
  },
  'test_comp_B': {
    company_id: '101'
  }
};
