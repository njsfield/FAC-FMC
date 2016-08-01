const {updatePollTable} = require('../../../polling/helpers/updatePollTable.js');
const {databaseTest} = require('../../wrapping-tape-setup.js');
const {checkLastPollTable} = require('../../../polling/db/checkTables.js');
const pg = require('pg');
const postgresURL = process.env.POSTGRES_URL_TEST;

databaseTest('testing whether the last-poll is updated', (t) => {
  t.plan(3);
  pg.connect(postgresURL, (err, dbClient, done) => {
    if (err) throw err;
    updatePollTable(dbClient, done, companyNames, companiesObj, startPollTime, (err1, response)=> {
      const actual = 'INSERT';
      const expected = response.command;
      t.deepEqual(actual, expected, 'company last poll updated');
      checkLastPollTable(dbClient, companiesObj['default'], done, (err2, response2) => {
        if (err2) console.log(err2);
        const actual1 = new Date(response2).toString();
        const expected1 = startPollTime.toString();
        t.equal(actual1, expected1, 'default has the startPOllTimeStored');
      });
      checkLastPollTable(dbClient, companiesObj['test_comp_B'], done, (err2, response2) => {
        if (err2) console.log(err2);
        const actual1 = new Date(response2).toString();
        const expected1 = startPollTime.toString();
        t.equal(actual1, expected1, 'test_comp_B has the startPollTime stored');
      });
    });
  });
});

const companyNames = ['default', 'test_comp_B'];
const companiesObj = {
  'default': {
    company_id: '100'
  },
  'test_comp_B': {
    company_id: '101'
  }
};

const startPollTime = new Date();
