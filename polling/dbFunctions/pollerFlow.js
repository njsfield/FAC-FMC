const checkTable = require('./checkTable.js')
const getID = require('./getID.js')

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
          done()
          getID.getCall_id(cli, obj, (res5) => {
            done()
            obj.call_id = res5
            cb(res4)
          })
        })
      })
    })
  })
}

const continuedPollerFlow = (cli, done, obj, cb) => {
  checkTable.checkUsersTable(cli, obj, () => {
    done()
    getID.getUser_id(cli, obj, (res) => {
      cb(res)
      done()
    })
  })
}

module.exports = {
  pollerFlow,
  continuedPollerFlow
}
