const fs = require('fs');
const polling_calls_api = require('../api/polling_calls_api.js');
const pg = require('pg');
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc';
const getID = require('../dbFunctions/getID.js');

const saveAudio = (file_name) => {
  const obj = {};
  obj.file_name = file_name;
  pg.connect(postgresURL, (err, client, done) => {
    getID.getFile_id(client, obj, (response) => {
      polling_calls_api.retrieveWav(file_name, (res) => {
        fs.writeFileSync(process.env.audio_folder + response + '.wav', res);
      });
      done();
    });
    pg.end();
  });
};

module.exports = {
  saveAudio
};
