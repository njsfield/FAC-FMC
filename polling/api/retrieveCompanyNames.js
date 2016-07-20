require('env2')('config.env');
const request = require('request');

module.exports = (callback) => {
  const options = {
    method: 'POST',
    url: process.env.PBX_URL + '/rest/auth',
    headers:
      { 'cache-control': 'no-cache',
      'content-type': 'application/json' },
    body: {
      auth: {
        type: 'auth',
        key: process.env.API_KEY
      }
    },
    json: true
  };

  request(options, function (error, response, companies) {
    if (error) throw (error);
    callback(companies);
  });
};
