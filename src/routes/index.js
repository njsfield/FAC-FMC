require('env2')('config.env');

// const JWT = require('jsonwebtoken')
// const validate = require('../auth/validate.js')

module.exports = {
  method: 'GET',
  path: '/',
  config: { auth: false },
  handler: (request, reply) => {
    // if (! request.state.token)
    //   return reply.view('login', { heading: 'Login' })
    //
    // const isVerified = JWT.verify(request.state.token, process.env.JWT_KEY)
    //
    // if (isVerified) {
    //   const decoded = JWT.decode(request.state.token)
    //   validate(decoded, request, (err, isValid) => {
    //     if (err || !isValid)
    //       return reply.view('login', { heading: 'Login' }).unstate('token')
    //
    //     return reply.redirect('/dashboard')
    //   })
    // } else {
    return reply.view('login');
  }
};
// }
