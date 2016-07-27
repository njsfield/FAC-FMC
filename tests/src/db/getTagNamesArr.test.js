const pg = require('pg');
const test = require('../../wrapping-tape-setup.js').databaseTest;
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest';
const getTagNames = require('../../../src/db/getTagNamesArr.js');

const tagNameObjOne = {
  company_id: 100
};

test('test the getFilterTagNamesArr function', (t) => {
  t.plan(1);
  pg.connect(postgresURL, (err, dbClient, done) => {
    if (err) throw err;
    getTagNames.getFilterTagNamesArr(dbClient, tagNameObjOne, done, (tagsArray) => {
      const actual = tagsArray;
      const expected = 'no tags';
      t.deepEqual(actual, expected, 'getFilterTagNamesArr returned no tags as expected');
    });
  });
});
