const fs = require('fs');
const JWT = require('jsonwebtoken');
const errorHandler = require('../../errorHandler.js');
const validate = require('../auth/validate.js');
const validateFetchFile = require('../db/validateFetchAudio.js');
module.exports = {
  method: 'GET',
  path: '/fetch-audio/{file_id}',
  config: {auth: false},
  handler: (request, reply) => {
    if (request.state.FMC) {
      const decoded = JWT.decode(request.state.FMC);
      validate(decoded, request, (error, isValid) => {
        if (error || !isValid) {
          return reply.redirect('/').unstate('FMC');
        }
        else {
          const fileId = request.params.file_id;
          validateFetchFile(decoded, file_id);
          const response = reply(fs.createReadStream(process.env.PLAY_AUDIO_PATH + `${fileId}.wav`));
          response.type('audio/wav');
        }
      });
    } else {
      return reply.redirect('/');
    }
  }
};
