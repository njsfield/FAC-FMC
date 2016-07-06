const fetchAudio = require('../db/fetchAudio.js');
module.exports = {
  method: 'GET',
  path: '/fetch-audio/{file_id}',
  handler: (request, reply) => {
    const postgresURL = process.env.POSTGRES_URL;
    const file_id = request.params.file_id;
    fetchAudio.fetchAudio(postgresURL, file_id, (results) => {
      reply(results);
    });
  }
};
