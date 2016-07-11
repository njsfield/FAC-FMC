const validate = require('../auth/validate.js');
const JWT = require('jsonwebtoken');

module.exports = {
  method: 'POST',
  path: '/filtered-calls',
  handler: (request, reply) => {
    const filterSpec = JSON.parse(request.payload);
    const decoded = JWT.decode(request.state.token);
    validate(decoded, request, (error, isValid) => {
      if (error || !isValid) {
        return reply.redirect('/').unstate('token');
      }
      else {
        reply.redirect('/dashboard');
      }
    });
  }
};
