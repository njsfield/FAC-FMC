const pbxUrl = 'https://fac1.ipcortex.net'

module.exports = {
  method: 'get',
  path: '/login',
  handler: (request, reply) => {

  }
}
const options = {
  method: 'POST',
  url: pbxUrl + '/rest/auth',
  headers:
  { 'cache-control': 'no-cache',
  'content-type': 'application/json' },
  body:
  {
    auth: {
      type: 'auth',
      username: '',
      password: ''
    }
  },
  json: true }
const people = { // our "users database"
  1: {
    id: 1,
    name: 'Jen Jones'
  }
}

const validate = function (decoded, request, callback) {

// do your checks to see if the person is valid
  if (!people[decoded.id]) {
    return callback(null, false)
  }
  else {
    return callback(null, true)
  }
}

module.exports = {
  validate
}
