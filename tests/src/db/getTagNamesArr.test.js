const pg = require('pg');
const tape = require('tape');
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest';
const getTagNames = require('../../../src/db/getTagNamesArr.js');

const tagNameObjOne = {
  company_id: 100
};

var actual;

tape('test the getFilterTagNamesArr function', (t) => {
  t.plan(1);
  pg.connect(postgresURL, (err, dbClient, done) => {
    if (err) throw err;
    getTagNames.getFilterTagNamesArr(dbClient, tagNameObjOne, (res) => {
      console.log(res, '<------ res');
      res.forEach((el) => {
        if (el.tag_name === 'important' && el.tag_id === '100') {
          actual = true;
        }
      });
      const expected = true;
      t.deepEqual(actual, expected, 'getFilterTagNamesArr returned the expected array of tag_names for that contact_id');
      done();
    });
  });
});
