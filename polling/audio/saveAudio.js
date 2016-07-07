const fs = require('fs');
const pollingCalls = require('../api/pollingCalls.js');
const pg = require('pg');
const postgresURL = process.env.POSTGRES_URL;
const getIds = require('../db/getIds.js');

const saveAudio = (file_name) => {
  const obj = {
    file_name
  };
  pg.connect(postgresURL, (err, client, done) => {
    getIds.getFile_id(client, obj, (response) => {
      pollingCalls.retrieveWav(file_name, (res) => {
        fs.writeFileSync(process.env.audio_folder + response + '.wav', res);
      });
      done();
    });
  });
};

module.exports = {
  saveAudio
};
