const pollCalls = require('./api/polling_calls_api.js')
const checkTables = require('./dbFunctions/checkingTables.js')
const fs = require('fs')
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc'
const pg = require('pg')

pollCalls.updateFileNames('default', (files) => {

// • check audiofile is in the file table
//                 => yes: by pass
//         => no: create row in file table : file_id
// • check file_id is associated with comapny A in calls table
//         => yes: finish with record
//         => no: create row in call table: call_id
// • create row in participants table
// • check if extension number exists in the hash
//                 => yes: by pass
//         => no: create a hash of extension numbers
  files.forEach((file) => {
    //   • response = array of call objects for a particular company
    pg.connect(postgresURL, (err, client, done) => {
      if (err) throw err
      checkTables.checkFilesTable(client, file, (result) => {
        console.log(result)

      })
      done()
    })
    pg.end()

    // pollCalls.retrieveWav(file.file_name, (data) => {
    //   fs.writeFileSync(file.file_name, data)
    // })

  })
})
