const pg = require('pg');
const tape = require('tape');
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest';
const getTagNames = require('../../../polling/db/getTagNamesArr.js');

const tagNameObjOne = {
  company_id: 100
};

tape('test the getTagNamesArr function', (t) => {
  t.plan(1);
  pg.connect(postgresURL, (err, dbClient, done) => {
    if (err) throw err;
    getTagNames.getTagNamesArr(dbClient, tagNameObjOne, (res) => {
      const actual = res;
      const expected = [ 'important', 'financial' ];
      t.deepEqual(actual, expected, 'getTagNamesArr returned the expected array of tag_names for that contact_id');
      done();
    });
  });
});
