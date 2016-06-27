const tape = require('tape');
const pg = require('pg');
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest';

tape('polling index function tests', (t) => {
  t.plan(2);
  const extObjNoOwner = {
    virt_exten: '238',
    company: 'default',
    scoped_exten: '238'
  };
  const extObjOwnerNull = {
    virt_exten: '238',
    company: 'default',
    scoped_exten: '238',
    owner: null
  };
  pg.connect(postgresURL, (err, dbClient, done) => {
    if (err) throw err;
    const queryArray = [true, extObjNoOwner.company, extObjNoOwner.virt_exten, extObjNoOwner.owner];
    dbClient.query('UPDATE participants SET internal=($1) WHERE company_id=(SELECT company_id FROM companies WHERE company_name=$2) AND number=($3)',
    queryArray, (error, response) => {
      if (error) throw error;
      console.log(response, 'RESPONSE');
      const actual = response.command;
      const expected = 'UPDATE';
      t.deepEqual(actual, expected, 'calls results restructured');
      done();
    });
    const queryArray2 = [true, extObjOwnerNull.company, extObjOwnerNull.virt_exten, extObjOwnerNull.owner];
    dbClient.query('UPDATE participants SET internal=($1) WHERE company_id=(SELECT company_id FROM companies WHERE company_name=$2) AND number=($3)',
    queryArray2, (error, response) => {
      const actual = response.command;
      const expected = 'UPDATE';
      t.deepEqual(actual, expected, 'calls results restructured');
      done();
    });
  });
  pg.end();
});
