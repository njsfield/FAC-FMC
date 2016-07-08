require('env2')('config.env');
const request = require('request');
const apiKey = process.env.API_KEY;

/**
 * Fetches an array of file_names by company_name from the IPC API.
 * @param {string} company_name
 * @param {function} callback - Returns an array of file objects:
   { caller: '239',
    callee: '238',
    duration: 6,
    company_name: 'default',
    date: 1465997840,
    file_name: '2016.06.15.14.37.20-1465997840-239-238.wav' }
 */
const fileObjs = {
  caller: '239',
  callee: '238',
  duration: 6,
  company_name: 'default',
  date: 1465997840,
  file_name: '2016.06.15.14.37.20-1465997840-239-238.wav'
};

const retrieveCompanyCalls = (company_name, callback) => {
  const options = {
    method: 'POST',
    url: process.env.PBX_URL + '/rest/call/list',
    headers:
    { 'cache-control': 'no-cache',
    'content-type': 'application/json' },
    body:
    { type: 'recording',
    scope: { company: company_name },
    auth: { type: 'auth', key: apiKey } },
    json: true };

  request(options, (error, response, body) => {
    if (error) throw error;

    if (body.result === 'fail') {
      callback([fileObjs]);
    }
    else {
      const files = body.values.map((el) => {
        delete el.size;
        el.company_name = company_name;
        el.date = el.start;
        delete el.start;
        el.file_name = el.file;
        delete el.file;
        return el;
      });
      callback(files);
    }
  });
};

/**
 * Fetches the actual wav file using the file_names returned from retrieveCompanyCalls().
 * @param {string} file_name
 * @param {function} callback - Returns wav file to root folder.
 */

const retrieveWav = (file_name, callback) => {
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

/**
 * Fetches caller details for a particular company_name.
 * @param {string} company_name
 * @param {array} extension_list - array of strings
 * @param {function} callback - returns body object:
 *  { result: 'success', values: [], numrows: 0 }
 *
 *  where the 'values' array contains objects:
 *  { virt_exten: '238',
       company: 'default',
       scoped_exten: '238',
       owner: 255 }
 */

const retrieveCallerDetails = (company_name, extension_list, callback) => {
  const options = {
    method: 'post',
    url: process.env.PBX_URL + '/rest/dialplan/read',
    encoding: null,
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json'
    },
    body: {
      type: 'extension',
      scope: {     // eg "400"
        'virt_exten': extension_list,    // eg "400_company",
        'company': company_name,
      },
      auth: {
        type: 'auth',
        key: apiKey
      },
      columns: [
        'virt_exten',
        'company',
        'scoped_exten',
        'owner'
      ]
    },
    json: true
  };
  request(options, function (error, response, body) {
    if (error) throw error;
    callback(body);
  });
};

module.exports = {
  retrieveCompanyCalls,
  retrieveWav,
  retrieveCallerDetails
};
