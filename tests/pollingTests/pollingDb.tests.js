const pg = require('pg')
const tape = require('tape')
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest'
const pollingFuncs = require('../../polling/dbFunctions/checkingTables.js')

tape('tests if file exists in files table', (t) => {
  const arrayOfObj = [{
    file_index: 1,
    file_name: 'recording_1'
  }, {
    file_index: 2,
    file_name: 'recording_2'
  }]

  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    arrayOfObj.map(e => {
      pollingFuncs.checkFilesTable(postgresURL, client, e, (res) => {
        const expected = true
        const boolKey = Object.keys(res.rows[0])[0]
        const actual = res.rows[0][boolKey]
        t.deepEqual(actual, expected, 'file_name recording_1 is in files table')
        done()
      })
    })
    t.end()
    pg.end()
  })
})

tape('tests that file does NOT exist in files table and then adds it', (t) => {
  const arrayOfObj = [{
    file_index: 44,
    file_name: 'recording_44'
  }, {
    file_index: 45,
    file_name: 'recording_45'
  }]

  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    arrayOfObj.map(e => {
      pollingFuncs.checkFilesTable(postgresURL, client, e, (res) => {
        const expected = 'INSERT'
        const actual = res.command
        t.deepEqual(actual, expected, 'file_name recording_44 has been added to files table')
        done()
      })
    })
    t.end()
    pg.end()
  })
})
