require('env2')('config.env');
const JWT = require('jsonwebtoken');
const loginApi = require('../../polling/api/check_caller_identification_api.js');

module.exports = {
  method: 'POST',
  path: '/login',
  config: { auth: false },
  handler: (request, reply) => {
    const password = request.payload.password;
    const username = request.payload.username;
    loginApi.checkLoginDeets(username, password, 'default', (user) => {

      if (user.result === 'success') {

        const token = JWT.sign({
          username,
          password
        }, process.env.JWT_KEY);

        reply.redirect('/dashboard').state('token', token);
      }
    });
  }
};
