require('env2')('config.env');
const request = require('request');
const apiKey = process.env.API_KEY;
/**
 * Fetches the actual wav file using the file_names returned from retrieveCompanyCalls().
 * @param {string} file_name
 * @param {function} callback - Returns wav file to root folder.
 */

module.exports = (file_name, callback) => {
  const options = { method: 'POST',
  url: process.env.PBX_URL + '/rest/call/download/recording',
  encoding: null,
  headers:
  { 'cache-control': 'no-cache',
  'content-type': 'application/json' },
  body:
  { type: 'recording',
  scope:
  { company: 'default',
  file: file_name },
  auth: { type: 'auth', key: apiKey } },
  json: true };

  request(options, function (error, response, wav_file) {
    if (error) throw (error);

    callback(wav_file);
  });
};
