const JWT = require('jsonwebtoken');
const loginApi = require('../../polling/api/check_caller_identification_api.js');

function validate (body, decoded, request, callback) {
  console.log(decoded);
  // do your checks to see if the person is valid
  if (!body.user[decoded.id]) {
    return callback(null, false);
  }
  else {
    return callback(null, true);
  }
}

function verify (decoded, request, callback) {
  return callback(null, true, decoded);
};

module.exports = {
  routeObj: {
    method: 'GET',
    path: '/login',
    config: { auth: false },
    handler: (request, reply) => {
      loginApi.checkLoginDeets('default', (body) => {
        if (body.result === 'success') {

          const secret = 'guigihfkhfkh';

          const token = JWT.sign(body.user, secret); // synchronous
          console.log(body, '<<<<<<<<<<<<<<<<<<<<<<<');
          const user = '4387735'; // const user = body.user.login (what it would be)
          const comp = '100';
          reply.redirect(`/dashboard/${user}/${comp}`).state('token', token);
        } else {
          reply.redirect('/');
        }
      });
    }
  },
  validate,
  verify
};
