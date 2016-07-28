require('env2')('config.env');

const JWT = require('jsonwebtoken');
const validate = require('../auth/validate.js');

module.exports = {
  method: 'GET',
  path: '/',
  config: {auth: false},
  handler: (request, reply) => {
    if (!request.state.FMC) {
      return reply.view('login');
    }
    else {
      return reply.redirect('/dashboard');
    }
  }
};
