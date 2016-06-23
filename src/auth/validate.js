const loginApi = require('../../polling/api/check_caller_identification_api.js');

module.exports = (decoded, request, callback, username, password) => {
  loginApi.checkLoginDeets(username, password, 'default', (user) => {
    // console.log(username, '<---- login.api username')
    // console.log(decoded, '<------- decoded')
    if (user.result !== 'success') {
      return callback(null, false);
    }
    else {
      return callback(null, true);
    }
  });
};
