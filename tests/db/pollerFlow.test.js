const pg = require('pg');
const tape = require('tape');
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest';
const pollerFlow = require('../../polling/dbFunctions/pollerFlow.js').pollerFlow;

const obj = {
  company_name: 'test_comp_A',
  file_name: 'recording_1',
  user_name: 'testUser'
};
tape('test the pollerFlow', (t) => {
  t.plan(1);
  pg.connect(postgresURL, (err, client, done) => {
    pollerFlow(client, done, obj, (res) => {
      console.log(res, '<<<<<<<<<<<<<<<<<<<<<TEST');
    });
    done();
  });
  pg.end();
});
