const pg = require('pg');
const tape = require('tape');
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest';
const getFilterName = require('../../../polling/db/getFilterName.js');

const filter_nameObj1 = {
  contact_id: 238
};
const filter_nameObj2 = {
  contact_id: 100
};

tape('test the getFilter_name functions', (t) => {
  t.plan(2);
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err;
    getFilterName.getFilter_name(client, filter_nameObj1, (res) => {
      const actual = res;
      const expected = [ { filter_name: 'test-filter' } ];
      t.deepEqual(actual, expected, 'getFilter_name got the correct filter_name from filters table');
      done();
    });
    getFilterName.getFilter_name(client, filter_nameObj2, (res) => {
      const actual = res;
      const expected = [
        { filter_name: 'test-filter' },
        { filter_name: 'super-filter' }
      ];
      t.deepEqual(actual, expected, 'getFilter_name got all the correct filter_names from filters table');
      done();
    });
    // pg.end();
  });
});
