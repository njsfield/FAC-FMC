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
  checkTable.checkUsersTable(cli, obj, (res) => {
    console.log(res, 'RES10 <<<<<<<<<<<<<<')
    getID.getUser_id(cli, obj, (res2) => {
      obj.user_id = res2
/*    addToParticipantsTable: {
        call_id: 100,
        company_id: 100,
        number: 1,
        internal: false,
        participant_role: 'source',
        user_id: 12345
      }   */
      const callee = {
        call_id: obj.call_id,
        company_id: obj.company_id,
        number: obj.callee,
        internal: false,
        participant_role: 'destination',
        user_id: obj.user_id
      }
      const caller = {
        call_id: obj.call_id,
        company_id: obj.company_id,
        number: obj.caller,
        internal: false,
        participant_role: 'source',
        user_id: obj.user_id
      }
      insertData.addToParticipantsTable(cli, obj, (res3) => {
        console.log(res3, 'RES6<<<<<<<<<<<<<<<<<<<<<')
      })
      insertData.addToParticipantsTable(cli, obj, (res4) => {
        console.log(res4, 'RES7<<<<<<<<<<<<<<<<<<<<<')
      })
    })
  })
}

/* API REQUEST to check Caller and Callee
goes in here. Need to write func */
//   checkTable.checkUsersTable(cli, obj, (res10) => {
//     console.log(res10, 'RES10 <<<<<<<<<<<<<<')
//     getID.getUser_id(cli, obj, (res5) => {
//       obj.user_id = res5
// /*    addToParticipantsTable: {
//         call_id: 100,
//         company_id: 100,
//         number: 1,
//         internal: false,
//         participant_role: 'source',
//         user_id: 12345
//       }   */
//       const callee = {
//         call_id: obj.call_id,
//         company_id: obj.company_id,
//         number: obj.callee,
//         internal: false,
//         participant_role: 'destination',
//         user_id: obj.user_id
//       }
//       const caller = {
//         call_id: obj.call_id,
//         company_id: obj.company_id,
//         number: obj.caller,
//         internal: false,
//         participant_role: 'source',
//         user_id: obj.user_id
//       }
//       insertData.addToParticipantsTable(cli, callee, (res6) => {
//         console.log(res6, 'RES6<<<<<<<<<<<<<<<<<<<<<')
//       })
//       insertData.addToParticipantsTable(cli, caller, (res7) => {
//         console.log(res7, 'RES7<<<<<<<<<<<<<<<<<<<<<')
//       })
//     })
//   })

// console.log(res4, 'RES4')
// if (res4.command === 'INSERT') {
//   getID.getCall_id(cli, obj, (res5) =>{
//     obj.call_id = res5
    // const callee = {
    //   call_id: obj.call_id,
    //   internal: false,
    //   participant_role: 'destination',
    //   number: obj.callee
    // }
    // const caller = {
    //   call_id: obj.call_id,
    //   internal: false,
    //   participant_role: 'source',
    //   number: obj.caller
    // }
    // insertData.addToParticipantsTable(cli, callee, (res6) => {
    //   console.log(res6, 'RES6<<<<<<<<<<<<<<<<<<<<<')
    // })
    // insertData.addToParticipantsTable(cli, caller, (res7) => {
    //   console.log(res7, 'RES7<<<<<<<<<<<<<<<<<<<<<')
    // })
//     done()
//
//   })
// } else {
//   cb(res4)
// }
module.exports = {
  pollerFlow,
  continuedPollerFlow
}
