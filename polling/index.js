const pollCalls = require('./api/polling_calls_api.js')
const checkTables = require('./dbFunctions/checkingTables.js')
const checkIds = require('./api/check_caller_identification_api.js')
const fs = require('fs')
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc'
const pg = require('pg')

pollCalls.updateFileNames('default', (files) => {
  const company_name = 'default'
  const participantsList = []
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    files.forEach((file, i) => {
  // add numbers to a list of participants to check with an api call
      if (participantsList.indexOf(file.callee) < 0 ) participantsList = participantsList.concat([file.callee])
      if (participantsList.indexOf(file.caller) < 0 ) participantsList = participantsList.concat([file.caller])
  //   • response = array of call objects for a particular company
      checkTables.pollerFlow(client, file, (result) => {
        console.log(result)
  // • create row in participants table
  // • check if extension number exists in the hash
  //                 => yes: by pass
  //         => no: create a hash of extension numbers
      })
      done()
      if(i === files.length - 1) {
        pollCalls.retrieveCallerDetails(company_name, participantsList, (response) => {
          console.log(response)
        })
      }
    })

    pg.end()

    // pollCalls.retrieveWav(file.file_name, (data) => {
    //   fs.writeFileSync(file.file_name, data)
    // })

  })
})

checkIds.checkLoginDeets('default', (body) => {
  console.log(body)
  return body
})
