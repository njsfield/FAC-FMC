const pg = require('pg')
const tape = require('tape')
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest'
const pollingFuncs = require('../../polling/dbFunctions/checkingTables.js')

tape('tests if file exists in files table', (t) => {
  const obj = {
    file_index: 1,
    file_name: 'recording_1'
  }

  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    pollingFuncs.checkFilesTable(postgresURL, obj, (res) => {
      const expected = true
      const actual = res.rows[0].exists
      t.deepEqual(actual, expected, 'file_name recording_1 is in files table')
      done()
      t.end()
    })
  })
})

tape('tests that file does NOT exist in files table and then adds it', (t) => {
  const obj = {
    file_index: 2,
    file_name: 'recording_2'
  }

  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    pollingFuncs.checkFilesTable(postgresURL, obj, (res) => {
      const expected = 'INSERT'
      const actual = res.command
      t.deepEqual(actual, expected, 'file_name recording_2 has been added to files table')
      done()
      t.end()
    })
  })
})
