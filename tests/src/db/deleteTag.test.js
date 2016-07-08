const tape = require('tape');
const postgresURL = process.env.POSTGRES_URL_TEST;
const deleteTag = require('../../../src/db/deleteTag.js');

const obj = {
  call_id: 100,
  tag_id: 100
};

const pg = require('pg');
tape('check that we can delete a tag according to the call_id', (t) => {
  t.plan(1);
  const expected = 'DELETE';
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err;
    deleteTag.deleteTag(client, obj, (result) => {
      const actual = result.command;
      t.deepEqual(actual, expected, 'tag_id deleted from tags_calls table');
      done();
    });
  });
});
