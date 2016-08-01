const test = require('../../wrapping-tape-setup.js').databaseTest;
const postgresURL = process.env.POSTGRES_URL_TEST;
const deleteTag = require('../../../src/db/deleteTag.js');

const obj = {
  call_id: 100,
  tag_id: 100
};

const pg = require('pg');
test('check that we can delete a tag according to the call_id', (t) => {
  t.plan(1);
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err;
    deleteTag(client, obj, done, (err1, res) => {
      const actual = res;
      const expected = 'Does not exist in table';
      t.deepEqual(actual, expected, 'tag_id deleted from tags_calls table');
      done();
    });
  });
});
