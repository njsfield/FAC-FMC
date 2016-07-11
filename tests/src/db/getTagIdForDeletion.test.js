const pg = require('pg');
const tape = require('tape');
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest';
const getTagId = require('../../../src/db/getTagIdForDeletion.js');

const getTagIdObj = {
  company_id: 100,
  tag_name: 'important'
};

tape('test the getTagIdForDeletion function', (t) => {
  t.plan(1);
  pg.connect(postgresURL, (err, dbClient, done) => {
    if (err) throw err;
    getTagId.getTagIdForDeletion(dbClient, getTagIdObj, (res) => {
      const actual = res.rows;
      const expected = [ { tag_id: '100' } ];
      t.deepEqual(actual, expected, 'getTagIdForDeletion returned the correct tag_id');
      done();
    });
  });
});
