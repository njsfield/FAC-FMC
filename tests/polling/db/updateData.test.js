const pg = require('pg');
const tape = require('tape');
const postgresURL = process.env.POSTGRES_URL_TEST;
const updateData = require('../../../polling/db/updateData.js');

const expected = 'UPDATE';

tape('test the insertData functions', (t) => {
  t.plan(1);
  pg.connect(postgresURL, (err, dbClient, done) => {
    if (err) throw err;
    const date = (Date.now()/1000);
    updateData.updateLastPollTable(dbClient, {last_poll: date}, (res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'updated last_poll table');
      done();
    });
  });
});
