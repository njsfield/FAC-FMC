const pg = require('pg');
const test = require('../../wrapping-tape-setup.js').databaseTest;
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest';
const getTagId = require('../../../src/db/getTagIdForDeletion.js');

const getTagIdObj = {
  company_id: 100,
  tag_name: 'important'
};

test('test the getTagIdForDeletion function', (t) => {
  t.plan(1);
  pg.connect(postgresURL, (err, dbClient, done) => {
    if (err) throw err;
    getTagId.getTagIdForDeletion(dbClient, getTagIdObj, done, (res) => {
      const actual = res;
      const expected = 'doesn\'t exist';
      t.deepEqual(actual, expected, 'getTagIdForDeletion returned doesn\'t exist as tag is not there');
    });
  });
});
