const tape = require('tape');
const postgresURL = process.env.POSTGRES_URL_TEST;
const fetchAudio = require('../../src/db/dbFetchAudio.js');
const pg = require('pg');
tape('check that we can fetch the audio with a file_id', (t) => {
  t.plan(1);
  const expected = [ { file_id: '100', file_name: 'recording_1' } ];
  const file_id = '100';
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err;
    fetchAudio.fetchAudio(client, file_id, (result) => {
      const actual = result;
      t.deepEqual(actual, expected, 'call file_id found');
      done();
    });
  });
  pg.end();
});
