const tape = require('tape')
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest'
const fetchAudio = require('../../src/db/dbFetchAudio.js')
const pg = require('pg')
tape('check that we can fetch the audio with a file_id', (t) => {
  t.plan(1)
  const expected = [ { file_id: '100', file_index: '1', file_name: 'recording_1' } ]
  const file_id = '100'
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    fetchAudio.fetchAudio(client, done, file_id, (result) => {
      const actual = result
      t.deepEqual(actual, expected, 'call file_id found')
    })
  })
  pg.end()
})
