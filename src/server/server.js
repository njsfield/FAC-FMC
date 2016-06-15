const Hapi = require('hapi')
const Server = new Hapi.Server()
const port = process.env.PORT || 3000
const views = require('./views.js')

const plugins = [
  require('inert'),
  require('vision'),
  require('hapi-auth-jwt2')
]

const routes = [
  require('../routes/dashboard.js'),
  require('../routes/editTag.js'),
  require('../routes/fetchAudio.js'),
  require('../routes/fetchCalls.js'),
  require('../routes/index.js'),
  require('../routes/login.js'),
  require('../routes/logout.js'),
  require('../routes/schema.js'),
  require('../routes/tagCall.js'),
  require('../routes/publicdir.js')
]

Server.connection({port})

Server.register(plugins, (error) => {
  if (error) throw error

  Server.views(views)

  Server.route(routes)



  Server.auth.strategy('jwt', 'jwt',
    { key: 'NeverShareYourSecret',          // Never Share your secret key
      validateFunc: validate,            // validate function defined above
      verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
    })

  server.auth.default('jwt')
})

module.exports = Server
