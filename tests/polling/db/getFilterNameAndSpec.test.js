const pg = require('pg');
const tape = require('tape');
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest';
const getFilterNameAndSpec = require('../../../polling/db/getFilterNameAndSpec.js');

const filter_nameObj1 = {
  contact_id: 238
};
const filter_nameObj2 = {
  contact_id: 100
};

var actual;

tape('test the getFilter_name functions', (t) => {
  t.plan(2);
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err;
    getFilterNameAndSpec.getFilterNameAndFilterSpec(client, filter_nameObj1, (res) => {
      res.forEach((el) => {
        if (el.filter_name === 'test-filter') {
          actual = true;
        }
      });
      const expected = true;
      t.deepEqual(actual, expected, 'getFilter_name got the correct filter_name and spec from filters table for one filter');
      done();
    });
    getFilterNameAndSpec.getFilterNameAndFilterSpec(client, filter_nameObj2, (res) => {
      res.forEach((el) => {
        if (el.filter_name === 'test-filter') {
          if(el.filter_name === 'super-filter') {
            actual = true;
          }
        }
      });
      const expected = true;
      t.deepEqual(actual, expected, 'getFilter_name got all the correct filter_names and specs from filters table for two filters');
      done();
    });
  });
});
