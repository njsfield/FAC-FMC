const pg = require('pg');
const {databaseTest} = require('../../wrapping-tape-setup.js');
const postgresURL = process.env.POSTGRES_URL_TEST;
const updateData = require('../../../polling/db/updateData.js');

databaseTest('test the insertData functions', (t) => {
  t.plan(2);
  pg.connect(postgresURL, (err, dbClient, done) => {
    const expected = 'UPDATE';
    if (err) throw err;
    const date = (Date.now());
    updateData.updateLastPollTable(dbClient, {last_poll: date, company_id: 100}, done, (err1, res) => {
      if (err1) console.log(err1, '<<<<<<<<<<<<<<<<<<<<');
      const actual = res.command;
      t.deepEqual(actual, expected, 'updated last_poll table');
      done();
    });
    updateData.updateParticipantsTable(dbClient, participantObj, companiesObj, done, (err1, res) => {
      const actual = res.command;
      t.deepEqual(actual, expected, 'updated participants table');
      done();
    });
  });
});

const participantObj =
  {
    owner: 35,
    company: 'default',
    virt_exten: '236',
    internal: false,
    participant_role: 'caller',
    contact_id: 12345
  };

const companiesObj = {
  default: {
    company_id: 100,

  }
};
