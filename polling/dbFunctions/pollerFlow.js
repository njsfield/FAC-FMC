const checkTable = require('./checkTable.js')
const getID = require('./getID.js')
const insertData = require('./insertData.js')
//This is the complete flow. Checks all tables required and adds
//data where necessary
const pollerFlow = (cli, done, obj, cb) => {
  //checks if file_name exists in files table
  checkTable.checkFilesTable(cli, obj, () => {
    done()
    getID.getCompany_id(cli, obj, (res2) => {
      done()
      obj.company_id = res2
      getID.getFile_id(cli, obj, (res3) => {
        done()
        obj.file_id = res3
        checkTable.checkCallsTable(cli, obj, (res4) => {
          // if doesnt exist add to partipants table
          if (res4.command === 'INSERT') {
            getID.getCall_id(cli, obj, (res5) =>{
              obj.call_id = res5
              const callee = {
                call_id: obj.call_id,
                internal: false,
                participant_role: 'destination',
                number: obj.callee
              }
              const caller = {
                call_id: obj.call_id,
                internal: false,
                participant_role: 'source',
                number: obj.caller
              }
              insertData.addToParticipantsTable(cli, callee, (res6) => {
                console.log(res6, 'RES6<<<<<<<<<<<<<<<<<<<<<')
              })
              insertData.addToParticipantsTable(cli, caller, (res7) => {
                console.log(res7, 'RES7<<<<<<<<<<<<<<<<<<<<<')
              })
              done()

            })
          } else {
            cb(res4)
          }
        })
      })
    })
  })
}

module.exports = {
  pollerFlow
}
