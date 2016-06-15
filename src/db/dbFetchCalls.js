'use strict'
const pg = require('pg')
// grab all calls for an individual user
const fetchCalls = (user_id, company_id, postgresURL, callback) => {
  checkPartipicantsTable(postgresURL, user_id, company_id, (result) => {
    restructureCallsResults(result, postgresURL, (response) => {
      callback(response)
    })

  })
}
// step 1: grabs the rows from the participants table which involve the user and their company.
const checkPartipicantsTable = (postgresURL, user_id, company_id, callback) => {
  pg.connect(postgresURL, (err, client, done) => {
    client.query('SELECT * FROM participants WHERE company_id = $1 AND user_id = $2',
    [company_id, user_id], (error, result) => {
      if (error) throw error
      callback(result.rows)
    })
    done()
  })
}

// step 2: reformats data into response object.
const restructureCallsResults = (data, postgresURL, callback) => {
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err

    var callList = []

    data.forEach((callParticipant, i) => {
      var callObj = responseFormatting(callParticipant.call_id, callParticipant.company_id)
      callObj.participants[callParticipant.participant_role.toLowerCase()] = {
        number: callParticipant.number,
        internal: true,
        user: true
      }
      findOtherParticipant(callObj, client, done, (result) => {
        findCallDetails(result, client, done, (response) => {
          console.log(response)
          callList = callList.concat([response])
          if (i === data.length - 1) {
            callback(callList)
          }
        })
      })
    })
  })
}

// step 3: structures the data.
const responseFormatting = (call_id, company_id) => {
  return {
    participants: {},
    call_id: call_id,
    company_id: company_id,
    file_id: '',
    duration: '',
    date: ''
  }
}

// step 4: locates caller or callee.
const findOtherParticipant = (callObj, client, done, callback) => {
  const participant = callObj.participants.source ? 'DESTINATION' : 'SOURCE'
  client.query('SELECT number, internal, participant_role FROM participants ' +
    'WHERE company_id = $1 AND call_id = $2 AND participant_role = $3',
    [callObj.company_id, callObj.call_id, participant], (error, result) => {
      if (error) throw error
      done()
      const response = result.rows
      const participant_role = response[0].participant_role.toLowerCase()
      callObj.participants[participant_role] = {
        user: false,
        number: response[0].number,
        internal: response[0].internal
      }
      callback(callObj)
    })
}

// step 5: gets call metadata.
const findCallDetails = (callObj, client, done, callback) => {
  client.query('SELECT file_id, duration, EXTRACT(EPOCH FROM date) FROM calls WHERE call_id = $1',
  [callObj.call_id], (error, result) => {
    if (error) throw error
    done()
    const response = result.rows
    const date = response[0].date_part
    callObj.file_id = response[0].file_id
    callObj.duration = response[0].duration
    callObj.date = new Date(date * 1000)
    callback(callObj)
  })
}

module.exports = {
  checkPartipicantsTable,
  restructureCallsResults,
  findOtherParticipant,
  findCallDetails,
  fetchCalls
}
