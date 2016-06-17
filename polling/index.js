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
      checkTables.pollerFlow(client, done, file, (result) => {
        if( result.command === 'INSERT') {
          if (participantsList.indexOf(file.callee) < 0 ) participantsList = participantsList.concat([file.callee])
          if (participantsList.indexOf(file.caller) < 0 ) participantsList = participantsList.concat([file.caller])
        }
        done()
        if (i === files.length -1 ) {
          pollCalls.retrieveCallerDetails(company_name, participantsList, (response) => {
            const result2 = {
              result: 'success',
              values:
               [ { virt_exten: '241',
                   company: 'default',
                   scoped_exten: '241',
                   owner: 261 },
                 { virt_exten: '238',
                   company: 'default',
                   scoped_exten: '238',
                   owner: 255 },
                 { virt_exten: '239',
                   company: 'default',
                   scoped_exten: '239',
                   owner: 257 } ],
              numrows: 3 }
            })

        }

      })
    })
    // pollCalls.retrieveWav(file.file_name, (data) => {
    //   fs.writeFileSync(file.file_name, data)
    // })

  })
})
