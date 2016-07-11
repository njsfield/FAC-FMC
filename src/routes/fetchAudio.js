const fs = require('fs');

module.exports = {
  method: 'GET',
  path: '/fetch-audio/{file_id}',
  handler: (request, reply) => {
    const fileId = request.params.file_id;
    const response = reply(fs.createReadStream(process.env.PLAY_AUDIO_PATH + `${fileId}.wav`));
    response.type('audio/wav');
  }
};
