require('env2')('config.env');
const JWT = require('jsonwebtoken');

module.exports = (decoded, request, callback) => {
  const isVerified = JWT.verify(request.state.token, process.env.JWT_KEY);

  if (!isVerified) {
    return callback(null, false);
  }
  else {
    return callback(null, true);
  }
};
