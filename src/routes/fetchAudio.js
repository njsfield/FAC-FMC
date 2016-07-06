const fetchAudio = require('../db/fetchAudio.js');
module.exports = {
  method: 'GET',
  path: '/fetch-audio/{file_id}',
  handler: (request, reply) => {
    const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc';
    const file_id = request.params.file_id;
    fetchAudio.fetchAudio(postgresURL, file_id, (results) => {
      reply(results);
    });
  }
};
