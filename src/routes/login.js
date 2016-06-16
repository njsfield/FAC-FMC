const JWT = require('jsonwebtoken')
const loginApi = require('../../polling/api/check_caller_identification_api.js')

const people = { // our "users database"
  1: {
    id: 1,
    name: 'Jen Jones'
  }
}

function validate (decoded, request, callback) {
  console.log(decoded)
  // do your checks to see if the person is valid
  if (!people[decoded.id]) {
    return callback(null, false)
  }
  else {
    return callback(null, true)
  }
}

function verify (decoded, request, callback) { 
  return callback(null, true, decoded)
};

module.exports = {
  routeObj: {
    method: 'GET',
    path: '/login',
    config: { auth: false },
    handler: (request, reply) => {
      loginApi.checkLoginDeets('default', (body) => {
        console.log(body, '<------ body')
        if (body.result === 'success') {

          const secret = 'guigihfkhfkh'

          const token = JWT.sign(body.user, secret) // synchronous
          console.log(token)

          reply.redirect('/dashboard').state('token', token)
        } else {
          reply.redirect('/')
        }
      })
    },
  },
  validate,
  verify
}
