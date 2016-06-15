const pollCalls = require('./api/polling_calls_api.js')
const checkTables = require('./dbFunctions/checkingTables.js')

pollCalls.updateFileNames('default', (files) => {
  console.log(files)
})
