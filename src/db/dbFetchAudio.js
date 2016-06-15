'use strict'
const pg = require('pg')

const fetchAudio = (postgresURL, file_id, callback) => {
  pg.connect(postgresURL, (err, client, done) => {
    client.query('SELECT * FROM files WHERE file_id = $1', [file_id], (error, result) => {
      if (error) throw error
      callback(result.rows)
    })
    done()
  })
  // pg.end()
}

module.exports = {
  fetchAudio
}
