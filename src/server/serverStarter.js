const Server = require('./server.js')

Server.start((error) => {
  if (error) throw error
  console.log(`Server is running on ${Server.info.uri}`)
})
