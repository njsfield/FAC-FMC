const tape = require('tape')
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest'
const fetchAudio = require('../../src/db/dbFetchAudio.js')

tape('check that we can fetch the audio with a file_id', (t) => {
  t.plan(1)
  const expected = [ { file_id: '100', file_index: '1', file_name: 'recording_1' } ]
  const file_id = '100'
  fetchAudio.fetchAudio(postgresURL, file_id, (result) => {
    const actual = result
    t.deepEqual(actual, expected, 'call file_id found')
  })
})
