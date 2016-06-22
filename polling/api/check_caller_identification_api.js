require('env2')('config.env');
const request = require('request');

/**
 * Sends username and password from client side server to IPC API for authentication.
 * @param {string} company_name
 * @param {function} callback - Returns the user object:
 *  user:
   { id: 239,
     login: 'fac30a',
     name: 'Virginie Trubiano',
     company: 'default',
     home: 'default',
     companies: [],
     session: 'ti8gKjr89/Nylf2+Vv0pt8S4',
     perms: { user: 'yes', ocm: 'yes', persq_panel: 'yes' } } }
 */

const checkLoginDeets = (company_name, callback) => {
  const options = {
    method: 'POST',
    url: process.env.PBX_URL + '/rest/auth',
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

  request(options, function (error, response, user) {
    if (error) throw (error);

    callback(user);
  });
};

module.exports = {
  checkLoginDeets
};
