const pg = require('pg');
const test = require('../../wrapping-tape-setup.js').databaseTest;
const postgresURL = process.env.POSTGRES_URL_TEST;
const getTagNames = require('../../../src/db/getTagNamesArr.js');

const tagNameObjOne = {
  company_id: 999
};

test('test the getFilterTagNamesArr function', (t) => {
  t.plan(1);
  pg.connect(postgresURL, (err, dbClient, done) => {
    if (err) throw err;
    getTagNames(dbClient, tagNameObjOne, done, (err1, tagsArray) => {
      const actual = tagsArray;
      const expected = 'no tags';
      t.deepEqual(actual, expected, 'getFilterTagNamesArr returned no tags as expected');
    });
  });
});
