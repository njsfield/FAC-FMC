const Hapi = require('hapi')
const Server = new Hapi.Server()
const port = process.env.PORT || 3000
const plugins = []

Server.connection({port})

const routes = [
  require('../routes/dashboard.js'),
  require('../routes/editTag.js'),
  require('../routes/fetchAudio.js'),
  require('../routes/fetchCalls.js'),
  require('../routes/index.js'),
  require('../routes/login.js'),
  require('../routes/logout.js'),
  require('../routes/schema.js'),
  require('../routes/tagCall.js')
]

Server.register(plugins, (error) => {
  if (error) throw error

  Server.route(routes)
})

module.exports = Server
