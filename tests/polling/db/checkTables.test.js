const pg = require('pg');
const {databaseTest} = require('../../wrapping-tape-setup.js');
const postgresURL = process.env.POSTGRES_URL_TEST;
const checkTables = require('../../../polling/db/checkTables.js');

databaseTest('test the checkTables functions', (t) => {
  t.plan(7);
  pg.connect(postgresURL, (err, dbClient, done) => {
    if (err) throw err;
    ////////////////// checks data is in tables //////////////////

    checkTables.checkCompaniesTable(dbClient, dataObj.companiesT[0], done, (err1, res) => {
      const expected = '100';
      const actual = res;
      t.deepEqual(actual, expected, 'company_id has been checked and found not to exist and added to the table');
      done();
    });

    checkTables.checkCompaniesTable(dbClient, dataObj.companiesT[1], done, (err1, res) => {
      const expected = '101';
      const actual = res;
      t.deepEqual(actual, expected, 'test company -B has been checked and found not to exist and added to the table');
      done();
    });

    checkTables.checkFilesTable(dbClient, dataObj.filesT[0], done, (err1, res) => {
      const actual = res;
      const expected = '100';
      t.deepEqual(actual, expected, 'file_names recording_1 and recording_2 are in files table');
      done();
    });
    checkTables.checkFilesTable(dbClient, dataObj.filesT[1], done, (err1, res) => {
      const actual = res;
      const expected = '101';
      t.deepEqual(actual, expected, 'file_names recording_1 and recording_2 are in files table');
      done();
    });
    checkTables.checkCallsTable(dbClient, dataObj.callsT, done, (err1, res) => {
      const actual = res;
      const expected = '100';
      t.deepEqual(actual, expected, 'call exists in calls table');
      done();
    });

    checkTables.checkParticipantsTable(dbClient, dataObj.participantsT, done, (err1, res) => {
      const actual = res;
      const expected = 100;
      t.deepEqual(actual, expected, 'data added in participants table');
      done();
      checkTables.checkParticipantsTable(dbClient, dataObj.participantsT, done, (err2, res1) => {
        const actual1 = res1;
        const expected1 = undefined;
        t.deepEqual(actual1, expected1, 'data exists in participants table');
        done();

      });
    });

  });
});

const dataObj = {
  companiesT: [
    {
      company_name: 'default',
    },
    {
      company_name: 'test_comp_B',
    }
  ],
  filesT: [
    {
      file_name: 'recording_1'
    },
    {
      file_name: 'recording_2'
    }
  ],
  callsT: {
    callee: '123',
    caller: '1234',
    duration: '3',
    company_id: '100',
    file_id: '100'
  },
  usersT: [
    {
      contact_id: 238,
      company_id: 100
    }, {
      contact_id: 239,
      company_id: 100
    }
  ],
  participantsT: {
    company_id: 100,
    call_id: 100,
    contact_id: 3222,
    internal: true,
    number: 100,
    participant_role: 'callee',
    hidden: false
  },
  tagsT: {
    tag_name: 'important',
    company_id: 100
  },
  filtersT: {
    filter_name: 'test-filter',
    contact_id: 238
  }
};
