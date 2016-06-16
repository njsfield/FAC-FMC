const pollCalls = require('./api/polling_calls_api.js')
const checkTables = require('./dbFunctions/checkingTables.js')
const checkIds = require('./api/check_caller_identification_api.js')
const fs = require('fs')

pollCalls.updateFileNames('default', (files) => {
  files.forEach((file) => {
    pollCalls.retrieveWav(file.file_name, (data) => {
      fs.writeFileSync(file.file_name, data)
    })
  })
})

checkIds.checkLoginDeets('default', (body) => {
  console.log(body)
  return body
})
