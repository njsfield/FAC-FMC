const pg = require('pg');
const test = require('../../wrapping-tape-setup.js').databaseTest;
const postgresURL = process.env.POSTGRES_URL_TEST;
const getFilterNameAndSpec = require('../../../src/db/getFilterNameAndSpec.js');

const filter_nameObj1 = {
  contact_id: 238
};

test('test the getFilter_name functions', (t) => {
  t.plan(1);
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err;
    getFilterNameAndSpec(client, filter_nameObj1, done, (err1, res) => {
      const actual = res;
      const expected = 'nothing was returned';
      t.deepEqual(actual, expected, 'no filters were returned as they did not exist');
    });
  });
});
