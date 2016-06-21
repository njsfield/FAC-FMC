const pollCalls = require('./api/polling_calls_api.js')
const pollerFlow = require('./dbFunctions/pollerFlow.js').pollerFlow
const continuedPollerFlow = require('./dbFunctions/pollerFlow.js').continuedPollerFlow
const insertData = require('./dbFunctions/insertData.js')
// const fs = require('fs')
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc'
const pg = require('pg')
const company_name = 'default'

pollCalls.updateFileNames(company_name, (files) => {
  var calleeList = []
  var callerList = []
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    files.forEach((file, i) => {
      pollerFlow(client, done, file, (result) => {
        if(result.command === 'INSERT') {
          if (calleeList.indexOf(file.callee) < 0 ) calleeList = calleeList.concat([file.callee])
          if (callerList.indexOf(file.caller) < 0 ) callerList = callerList.concat([file.caller])
        }
        done()
        if (i === files.length -1 ) {
          if (callerList.length > 0) {
            callerList.forEach((el) => {
              pollCalls.retrieveCallerDetails(company_name, el, (res) => {
                if (res.numrows !== 0) {
                  const user = {
                    user_role: 'testing', //hard coded data that will need to be changed <---------
                    user_name: res.values[0].owner,
                    company_id: file.company_id
                  }
                  continuedPollerFlow(client, done, user, (res2) => {
                    const caller = {
                      call_id: file.call_id,
                      company_id: file.company_id,
                      number: res.values[0].scoped_exten,
                      internal: false,
                      participant_role: 'source',
                      user_id: res2
                    }
                    if (res.values[0].company === file.company_name) {
                      caller.internal = true
                    }
                    insertData.addToParticipantsTable(client, caller, () => {
                      done()
                    })
                  })
                } else {
                  console.log('numrows was 0')
                }
              })
            })
          }
          else {
            console.log('callerList is empty')
          }
          if (calleeList.length > 0) {
            calleeList.forEach((el) => {
              pollCalls.retrieveCallerDetails(company_name, el, (res) => {
                if (res.numrows !== 0) {
                  const user = {
                    user_role: 'testing', //hard coded data that will need to be changed <---------
                    user_name: res.values[0].owner,
                    company_id: file.company_id
                  }
                  continuedPollerFlow(client, done, user, (res2) => {
                    const callee = {
                      call_id: file.call_id,
                      company_id: file.company_id,
                      number: res.values[0].scoped_exten,
                      internal: false,
                      participant_role: 'destination',
                      user_id: res2
                    }
                    if (res.values[0].company === file.company_name) {
                      callee.internal = true
                    }
                    insertData.addToParticipantsTable(client, callee, () => {
                      done()
                    })
                  })
                } else {
                  console.log('numrows was 0')
                }
              })
            })
          }
          else {
            console.log('callee list is empty as well')
          }
        }
      })
    })
  })
})
