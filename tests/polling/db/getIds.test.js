const pg = require('pg');
const tape = require('tape');
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest';
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

tape('test the getIds functions', (t) => {
  t.plan(5);
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err;
    getIds.getCompany_id(client, obj, (res) => {
      const actual = res;
      const expected = '100';
      t.deepEqual(actual, expected, 'getCompany_id got the correct company_id from companies table');
      done();
    });
    getIds.getFile_id(client, obj, (res) => {
      const actual = res;
      const expected = '100';
      t.deepEqual(actual, expected, 'getFile_id got the correct file_id from files table');
      done();
    });
    getIds.getCall_id(client, obj, (res) => {
      const actual = res;
      const expected = '100';
      t.deepEqual(actual, expected, 'getCall_id got the correct call_id from calls table');
      done();
    });
    getIds.getTag_id(client, obj, (res) => {
      const actual = res;
      const expected = '100';
      t.deepEqual(actual, expected, 'getTag_id got the correct tag_id from tags table');
      done();
    });
    getIds.getFilter_id(client, obj, (res) => {
      const actual = res;
      const expected = '100';
      t.deepEqual(actual, expected, 'getFilter_id got the correct filter_id from filters table');
      done();
    });
  });
});
