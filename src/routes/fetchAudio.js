const fs = require('fs');

module.exports = {
  method: 'GET',
  path: '/fetch-audio/{file_id}',
  config: {auth: false},
  handler: (request, reply) => {
    if (request.state.FMC) {
      const fileId = request.params.file_id;
      const response = reply(fs.createReadStream(process.env.PLAY_AUDIO_PATH + `${fileId}.wav`));
      response.type('audio/wav');
    } else {
      return reply.redirect('/');
    }
  }
};
