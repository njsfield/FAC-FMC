'use strict';
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

module.exports = (company_name, timeObj, callback) => {
  let scope = timeObj;
  scope.company = company_name;
  const options = {
    method: 'POST',
    url: process.env.PBX_URL + '/rest/call/list',
    headers:
    { 'cache-control': 'no-cache',
    'content-type': 'application/json' },
    body:
    { type: 'recording',
    scope: scope,
    auth: { type: 'auth', key: apiKey } },
    json: true };

  request(options, (error, response, body) => {
    if (error) throw error;

    if (body.result === 'fail') {
      callback(body);
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
