const pg = require('pg');
const tape = require('tape');
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest';
const checkTables = require('../../../polling/db/checkTables.js');

const existingDataObj = {
  companiesT: [
    {
      company_name: 'test_comp_A',
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
    file_id: 100,
    company_id: 100
  },
  usersT: {
    contact_id: 238
  },
  participantsT: {
    company_id: 100,
    call_id: 100,
    contact_id: 3222
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

const newDataObj = {
  companiesT: [
    {
      company_name: 'comp_A',
    },
    {
      company_name: 'comp_B',
    }
  ],
  filesT: {
    file_name: 'fake_recording_44'
  },
  usersT: {
    contact_id: 236,
    company_id: 100,
    user_role: 'yes'
  },
  participantsT: {
    company_id: 100,
    call_id: 100,
    internal: false,
    participant_role: 'caller',
    number: 1,
    contact_id: 999
  },
  tagsT: {
    tag_name: 'fresh',
    company_id: 100
  },
  filtersT: {
    filter_name: 'new-test-filter',
    contact_id: 238,
    filter_spec: {
      to: 100,
      from: '',
      contact_id: '',
      min: '',
      max: '',
      date: '',
      tags: ''
    }
  }
};

tape('test the checkTables functions', (t) => {
  t.plan(16);
  pg.connect(postgresURL, (err, client, done) => {
    const expected1 = true;
    const expected2 = 'INSERT';
    if (err) throw err;
    ////////////////// checks data is in tables //////////////////
    existingDataObj.companiesT.map((el) => {
      checkTables.checkCompaniesTable(client, el, (res) => {
        const boolKey = Object.keys(res.rows[0])[0];
        const actual = res.rows[0][boolKey];
        t.deepEqual(actual, expected1, 'company_name test_comp_A and test_comp_B are in companies table');
        done();
      });
    });
    existingDataObj.filesT.map((el) => {
      checkTables.checkFilesTable(client, el, (res) => {
        const boolKey = Object.keys(res.rows[0])[0];
        const actual = res.rows[0][boolKey];
        t.deepEqual(actual, expected1, 'file_names recording_1 and recording_2 are in files table');
        done();
      });
    });
    checkTables.checkCallsTable(client, existingDataObj.callsT, (res) => {
      const boolKey = Object.keys(res.rows[0])[0];
      const actual = res.rows[0][boolKey];
      t.deepEqual(actual, expected1, 'call exists in calls table');
      done();
    });
    checkTables.checkUsersTable(client, existingDataObj.usersT, (res) => {
      const boolKey = Object.keys(res.rows[0])[0];
      const actual = res.rows[0][boolKey];
      t.deepEqual(actual, expected1, 'user_name exists in users table');
      done();
    });
    checkTables.checkParticipantsTable(client, existingDataObj.participantsT, (res) => {
      const boolKey = Object.keys(res.rows[0])[0];
      const actual = res.rows[0][boolKey];
      t.deepEqual(actual, expected1, 'data exists in participants table');
      done();
    });
    checkTables.checkTagsTable(client, existingDataObj.tagsT, (res) => {
      const boolKey = Object.keys(res.rows[0])[0];
      const actual = res.rows[0][boolKey];
      t.deepEqual(actual, expected1, 'tag exists in tags table');
    });
    checkTables.checkFiltersTable(client, existingDataObj.filtersT, (res) => {
      const boolKey = Object.keys(res.rows[0])[0];
      const actual = res.rows[0][boolKey];
      t.deepEqual(actual, expected1, 'filter exists in filters table');
    });

    ///////////////////////// end /////////////////////

    /////////////// adds data to tables ///////////////
    newDataObj.companiesT.map((el) => {
      checkTables.checkCompaniesTable(client, el, (res) => {
        const actual = res.command;
        t.deepEqual(actual, expected2, 'company_name comp_A and comp_B have been added to companies table');
        done();
      });
    });
    checkTables.checkFilesTable(client, newDataObj.filesT, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected2, 'fake_recording_44 added to files table');
      done();
    });
    checkTables.checkUsersTable(client, newDataObj.usersT, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected2, 'guillaume added to users table');
      done();
    });
    checkTables.checkParticipantsTable(client, newDataObj.participantsT, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected2, 'new data added to participants table');
      done();
    });
    checkTables.checkTagsTable(client, newDataObj.tagsT, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected2, 'new data added to tags table');
      done();
    });
    checkTables.checkFiltersTable(client, newDataObj.filtersT, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected2, 'new filter added to filters table');
      done();
    });
    /////////////////////////// end /////////////////////////////
    pg.end();
  });
});

// tape('checks the poller flow with an already existing file_name', (t) => {
//   const obj = {
//     company_id: 100,
//     company_name: 'test_comp_A',
//     file_name: 'recording_1'
//   }
//   pg.connect(postgresURL, (err, client, done) => {
//     if (err) throw err
//     checkTables.pollerFlow(client, done, obj, (res) => {
//       const boolKey = Object.keys(res.rows[0])[0]
//       const actual = res.rows[0][boolKey]
//       const expected = true
//       t.deepEqual(actual, expected, 'this call is in the calls table')
//       done()
//     })
//     t.end()
//     pg.end()
//   })
// })
//
// tape('checks the poller flow with a new file_name', (t) => {
//   const obj = {
//     date: 1466121509,
//     duration: 123456,
//     company_name: 'test_comp_A',
//     file_name: 'recording_99'
//   }
//   pg.connect(postgresURL, (err, client, done) => {
//     if (err) throw err
//     pollingFuncs.pollerFlow(client, done, obj, (res) => {
//       const actual = res.command
//       const expected = 'INSERT'
//       t.deepEqual(actual, expected, 'the file and call have been added to the relevant tables')
//       done()
//     })
//     t.end()
//     pg.end()
//   })
// })

// tape('test if tag exists in tags table and if not, inserts it', (t) => {
//   const obj = {
//     tag: 'meeting',
//     user_id: 100
//   };
//   pg.connect(postgresURL, (err, client, done) => {
//     if (err) throw err;
//     checkTables.checkTagsTable(client, obj, (res) => {
//       const actual = res.command;
//       const expected = 'INSERT';
//       t.deepEqual(actual, expected, 'tag inserted into tags table');
//       done();
//     });
//     t.end();
//     pg.end();
//   });
// });
