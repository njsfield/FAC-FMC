const pollCalls = require('./api/polling_calls_api.js')
const checkTables = require('./dbFunctions/checkingTables.js')
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc'
const pg = require('pg')

pollCalls.updateFileNames('default', (files) => {
  const company_name = 'default'
  var participantsList = []
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    files.forEach((file, i) => {
      checkTables.pollerFlow(done, client, file, (result) => {
        if( result.command === 'INSERT') {
          if (participantsList.indexOf(file.callee) < 0 ) participantsList = participantsList.concat([file.callee])
          if (participantsList.indexOf(file.caller) < 0 ) participantsList = participantsList.concat([file.caller])
        }
        done()
        if (i === files.length -1 ) {
          pollCalls.retrieveCallerDetails(company_name, participantsList, (response) => {
            console.log(response)
          })
        }

      })
    })
    // pollCalls.retrieveWav(file.file_name, (data) => {
    //   fs.writeFileSync(file.file_name, data)
    // })

  })
})
