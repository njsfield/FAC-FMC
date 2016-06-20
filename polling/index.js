const pollCalls = require('./api/polling_calls_api.js')
const pollerFlow = require('./dbFunctions/pollerFlow.js').pollerFlow
const checkTable = require('./dbFunctions/checkTable.js')
// const continuedPollerFlow = require('./dbFunctions/pollerFlow.js').continuedPollerFlow
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc'
const pg = require('pg')

const responseFromApi = {
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
  numrows: 3
}

pollCalls.updateFileNames('default', (files) => {
  const company_name = 'default'
  var participantsList = []
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    files.forEach((file, i) => {
      pollerFlow(client, done, file, (result) => {
        if(result.command === 'INSERT') {
          if (participantsList.indexOf(file.callee) < 0 ) participantsList = participantsList.concat([file.callee])
          if (participantsList.indexOf(file.caller) < 0 ) participantsList = participantsList.concat([file.caller])
        }
        done()
        if (i === files.length -1 ) {
          pollCalls.retrieveCallerDetails(company_name, participantsList, (res) => {
            console.log(res, 'res<<<<<<<<<<<')
            file.user_role = 'testUser'
            file.user_name = res.user_name
            checkTable.checkUsersTable(client, file, (res2) => {
              console.log(res2, '<<<<<<<<<<<<<<<<<<')
            })
            console.log(file, '<<<<<<<<<<<< file')

          })

        }

      })
    })
    // pollCalls.retrieveWav(file.file_name, (data) => {
    //   fs.writeFileSync(file.file_name, data)
    // })
  })
})

// pollCalls.retrieveCallerDetails('default', '241', (res) => {
//   console.log(res, '<<<<<<<<<<<<<<<<<<<<<<<')
// })
