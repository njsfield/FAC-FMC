const pollCalls = require('./api/polling_calls_api.js')
const checkTables = require('./dbFunctions/checkingTables.js')
const fs = require('fs')

pollCalls.updateFileNames('default', (files) => {
  files.forEach((file) => {
    pollCalls.retrieveWav(file.file_name, (data) => {
      fs.writeFileSync(file.file_name, data)
    })
  })
})
