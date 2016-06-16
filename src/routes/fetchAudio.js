const dbFetchAudio = require('../db/dbFetchAudio.js')
module.exports = {
  method: 'GET',
  path: '/fetch-audio/{file_id}',
  handler: (request, reply) => {
    const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc'
    const file_id = request.params.file_id
    dbFetchAudio.fetchAudio(postgresURL, file_id, (results) => {
      reply(results)
    })
  }
}
