'use strict'
const fetchAudio = (client, done, file_id, callback) => {
  client.query('SELECT * FROM files WHERE file_id = $1', [file_id], (error, result) => {
    if (error) throw error
    callback(result.rows)
  })
  done()
}

module.exports = {
  fetchAudio
}
