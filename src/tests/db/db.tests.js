const tape = require('tape')
const pg = require('pg')
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest'
// test that the fmctest database is made

tape('test that the fmctest database and tables exists', (t) => {
  t.plan(5)
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    client.query('SELECT * FROM calls;', (error, results) => {
      if(error) {
        return console.error('error running query', err)
      }
      t.ok(results, 'calls table exists')
    })
    client.query('SELECT * FROM participants;', (error, results) => {
      if(error) {
        return console.error('error running query', err)
      }
      t.ok(results, 'participants table exists')
    })
    client.query('SELECT * FROM tags;', (error, results) => {
      if(error) {
        return console.error('error running query', err)
      }
      t.ok(results, 'tags table exists')
    })
    client.query('SELECT * FROM tags_calls;', function(error, results) {
      if(error) {
        return console.error('error running query', err)
      }
      t.ok(results, 'tags_calls table exists')
    })
    client.query('SELECT * FROM companies;', function(error, results) {
      if(error) {
        return console.error('error running query', err)
      }
      t.ok(results, 'companies table exists')
      client.end()
    })
  })
})
