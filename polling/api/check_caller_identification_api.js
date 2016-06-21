const pbxUrl = 'https://fac1.ipcortex.net';

  // fetches array of file_names
'use strict';
const request = require('request');

  // searches for filenames by companyId
const checkLoginDeets = (companyId, callback) => {
  const options = {
    method: 'POST',
    url: pbxUrl + '/rest/auth',
    headers:
      { 'cache-control': 'no-cache',
      'content-type': 'application/json' },
    body:
    {
      auth: {
        type: 'auth',
        username: 'fac30a',
        password: 'gh2ig32z'
      }
    },
    json: true
  };

  request(options, function (error, response, body) {
    if (error) throw (error);

    callback(body);
  });
};

module.exports = {
  checkLoginDeets
};
