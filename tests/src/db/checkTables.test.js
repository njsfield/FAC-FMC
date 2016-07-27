const pg = require('pg');
const test = require('../../wrapping-tape-setup.js').databaseTest;
const {checkUsersTable} = require('../../../src/db/checkTables.js');

test('checking the checkTables functions', (t) => {
  t.plan(1);
  pg.connect(process.env.POSTGRES_URL_TEST, (err, dbClient, done) => {
    if (err) throw err;
    checkUsersTable(dbClient, {tag_name: 'tagName', company_id: '100'}, done, (res) => {
      const expected = 'INSERT';
      const actual = res.command;
      console.log(actual, 2);
      t.deepEqual(actual, expected, 'user_name exists in users table');
    });
  });
});

//   checkTables.checkUsersTable(dbClient, existingDataObj.usersT[1], done, (res1) => {
//     const expected1 = 'SELECT';
//     const actual1 = res1.command;
//     console.log(actual1, 2);
//     t.deepEqual(actual1, expected1, 'user_name exists in users table');
//     done();
//
//   });
// });

// checkTables.checkUsersTable(dbClient, dataObj.usersT[0], done, (res) => {
//   console.log(res.command, '1');
//   const expected = 'INSERT';
//   const actual = res.command;
//   t.deepEqual(actual, expected, 'user_name doesnt in users table');
//   done();
// });

// checkTables.checkTagsTable(client, existingDataObj.tagsT, (res) => {
//   const boolKey = Object.keys(res.rows[0])[0];
//   const actual = res.rows[0][boolKey];
//   t.deepEqual(actual, expected1, 'tag exists in tags table');
// });
// checkTables.checkFiltersTable(client, existingDataObj.filtersT, (res) => {
//   const boolKey = Object.keys(res.rows[0])[0];
//   const actual = res.rows[0][boolKey];
//   t.deepEqual(actual, expected1, 'filter exists in filters table');
// });
//
// ///////////////////////// end /////////////////////
//
// /////////////// adds data to tables //////////////
// checkTables.checkTagsTable(client, newDataObj.tagsT, (res) => {
//   const actual = res.command;
//   t.deepEqual(actual, expected2, 'new data added to tags table');
//   done();
// });
// checkTables.checkFiltersTable(client, newDataObj.filtersT, (res) => {
//   const actual = res.command;
//   t.deepEqual(actual, expected2, 'new filter added to filters table');
//   done();
// });
/////////////////////////// end /////////////////////////////

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
    participant_role: 'callee'
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
