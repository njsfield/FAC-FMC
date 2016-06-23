require('env2')('config.env');
const JWT = require('jsonwebtoken');
const validate = require('../auth/validate.js');
// const loginApi = require('../../polling/api/check_caller_identification_api.js')
// const pg = require('pg')
// const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc'

// const checkUser = require('../../polling/dbFunctions/checkTable.js')

module.exports = {
  method: 'POST',
  path: '/login',
  config: { auth: false },
  handler: (request, reply) => {
    validate({
      username: request.payload.username,
      password: request.payload.password,
    }, request, (err, isValid) => {
      if (err || !isValid)
        return reply.redirect('/');

      const token = JWT.sign({
        username: request.payload.username,
        password: request.payload.password
      }, process.env.JWT_KEY);

      reply.redirect('/dashboard').state('token', token);
    }, request.payload.username, request.payload.password);
  }
};
