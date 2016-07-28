require('env2')('config.env');
const request = require('request');

/**
 * Sends username and password from client side server to IPC API for authentication.
 * @param {string} company_name
 * @param {function} callback - Returns the user object:
 *  { token: 'a very long string of random characters',
      expires: 1467111677.992,
      result: 'success',
      user:
       { id: 240,
         login: 'fac30b',
         name: 'Virginie Trubiano B',
         company: 'default',
         home: 'default',
         companies: [],
         session: 'ipBPs4Cq3XHbwmRQ6k6aksj3',
         perms: { user: 'yes', ocm: 'yes', persq_panel: 'yes' } } }
 */

const checkLoginDetails = (username, password, company_name, callback) => {
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
        username: username,
        password: password
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
  checkLoginDetails
};
