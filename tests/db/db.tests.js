const tape = require('tape')
const pg = require('pg')
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest'
const pollingFuncs = require('../../polling/dbFunctions/checkingTables.js')

// test that the fmctest database is made

tape('test that the fmctest database and tables exists', (t) => {
  const obj = {
    file_index: 1,
    file_name: 'recording_1'
  }
  t.plan(6)
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    client.query('SELECT * FROM calls;', function(error, results) {
      if(error) {
        return console.error('error running query', err)
      }
      t.ok(results, 'calls table exists')
    })
    client.query('SELECT * FROM participants;', function(error, results) {
      if(error) {
        return console.error('error running query', err)
      }
      t.ok(results, 'participants table exists')
    })
    client.query('SELECT * FROM tags;', function(error, results) {
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
    })
    pollingFuncs.checkFilesTable(postgresURL, client, obj, (res) => {
      const expected = true
      const actual = res.rows[0].exists
      t.deepEqual(actual, expected, 'file_name recording_1 is in files table')
      done()
      pg.end()
    })
  })
})
