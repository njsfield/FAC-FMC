require('env2')('config.env');
const request = require('request');

const checkLoginDeets = (callback) => {
  const options = {
    method: 'POST',
    url: process.env.PBX_URL + '/rest/auth',
    headers:
      { 'cache-control': 'no-cache',
      'content-type': 'application/json' },
    body: {
      auth: {
        type: 'auth',
        key: process.env.COMPANIES
      }
    },
    json: true
  };

  request(options, function (error, response, user) {
    if (error) throw (error);
    callback(user);
  });
};

checkLoginDeets( (res) => {
  console.log(res);
});
