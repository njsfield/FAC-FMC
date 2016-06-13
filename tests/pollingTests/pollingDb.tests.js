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
    pollingFuncs.checkFilesTable(postgresURL, client, obj, (res) => {
      const expected = true
      console.log(res, '<======')
      const actual = res.rows[0].exists
      t.deepEqual(actual, expected, 'file_name recording_1 is in files table')
      done()
      pg.end()
      t.end()
    })
  })
})

tape('tests that file does NOT exist in files table and then adds it', (t) => {
  const obj = {
    file_index: 44,
    file_name: 'recording_44'
  }

  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    pollingFuncs.checkFilesTable(postgresURL, client, obj, (res) => {
      const expected = 'INSERT'
      const actual = res.command
      t.deepEqual(actual, expected, 'file_name recording_44 has been added to files table')
      done()
      pg.end()
      t.end()
    })
  })
})
