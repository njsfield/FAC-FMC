const pg = require('pg');
const {databaseTest} = require('../../wrapping-tape-setup.js');
const postgresURL = process.env.POSTGRES_URL_TEST;
const getIds = require('../../../polling/db/getIds.js');
const obj = {
  company_name: 'default',
  file_name: 'recording_1',
  company_id: 100,
  file_id: 100,
  tag_name: 'important',
  filter_name: 'test-filter',
  contact_id: 238
};

databaseTest('test the getIds functions', (t) => {
  t.plan(1);
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err;
    getIds.getFile_id(client, obj, done, (err1, res) => {
      const actual = res;
      const expected = '100';
      t.deepEqual(actual, expected, 'getFile_id got the correct file_id from files table');
      done();
    });

  });
});
