const {databaseTest} = require('../../wrapping-tape-setup.js');
const pg = require('pg');
const postgresURL = process.env.POSTGRES_URL_TEST;
// test that the fmctest database is made

databaseTest('test that the fmctest database and tables exists', (t) => {
  t.plan(9);
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err;
    client.query('SELECT * FROM companies;', function(error, results) {
      if(error) {
        return console.error('error running query', err);
      }
      t.ok(results, 'companies table exists');
      done();
    });
    client.query('SELECT * FROM files;', function(error, results) {
      if(error) {
        return console.error('error running query', err);
      }
      t.ok(results, 'files table exists');
      done();
    });
    client.query('SELECT * FROM calls;', (error, results) => {
      if(error) {
        return console.error('error running query', err);
      }
      t.ok(results, 'calls table exists');
      done();
    });
    client.query('SELECT * FROM participants;', (error, results) => {
      if(error) {
        return console.error('error running query', err);
      }
      t.ok(results, 'participants table exists');
      done();
    });
    client.query('SELECT * FROM tags;', (error, results) => {
      if(error) {
        return console.error('error running query', err);
      }
      t.ok(results, 'tags table exists');
      done();
    });
    client.query('SELECT * FROM tags_calls;', function(error, results) {
      if(error) {
        return console.error('error running query', err);
      }
      t.ok(results, 'tags_calls table exists');
      done();
    });
    client.query('SELECT * FROM users;', function(error, results) {
      if(error) {
        return console.error('error running query', err);
      }
      t.ok(results, 'users table exists');
      done();
    });
    client.query('SELECT * FROM filters;', function(error, results) {
      if(error) {
        return console.error('error running query', err);
      }
      t.ok(results, 'filters table exists');
      done();
    });
    client.query('SELECT * FROM last_poll;', function(error, results) {
      if(error) {
        return console.error('error running query', err);
      }
      t.ok(results, 'last_poll table exists');
      done();
    });
  });
});
