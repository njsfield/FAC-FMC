'use strict'
const pg = require('pg')
// grab all calls for an individual user
const fetchCalls = (user, quantity) => {
  return user, quantity
}
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

const restructureCallsResults = (data, postgresURL, callback) => {
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    const newArray = data.map((callParticipant) => {
      let callObj = {
        participants: {},
        call_id: callParticipant.call_id,
        company_id: callParticipant.company_id,
        file_id: '',
        duration: '',
        date: ''
      }
      if (callParticipant.participant_role === 'SOURCE') {
        callObj.participants.source = {
          number: callParticipant.number,
          internal: true,
          user: true
        }
      } else {
        callObj.participants.destination = {
          number: callParticipant.number,
          internal: true,
          user: true
        }
      }
      findOtherParticipant(callObj, client, done, (result) => {
        const participant_role = result[0].participant_role.toLowerCase()
        callObj.participants[participant_role] = {
          user: false,
          number: result[0].number,
          internal: result[0].internal
        }
      })
      findCallDetails(callObj, client, done, (result) => {
        console.log(result)
        callObj.file_id = result[0].file_id
        callObj.duration = result[0].duration
        callObj.date = result[0].date
      })
      return callObj
    })
    setTimeout(callback(newArray), 5000)
  })

}

const findOtherParticipant = (call, client, done, callback) => {
  const participant = call.participants.source ? 'DESTINATION' : 'SOURCE'
  client.query('SELECT number, internal, participant_role FROM participants ' +
    'WHERE company_id = $1 AND call_id = $2 AND participant_role = $3',
    [call.company_id, call.call_id, participant], (error, result) => {
      if (error) throw error
      done()
      callback(result.rows)
    })
}

const findCallDetails = (call, client, done, callback) => {
  client.query('SELECT file_id, duration, date FROM calls WHERE call_id = $1',
  [call.call_id], (error, result) => {
    if (error) throw error
    done()
    callback(result.rows)
  })
}

module.exports = {
  fetchCalls,
  checkPartipicantsTable,
  restructureCallsResults,
  findOtherParticipant,
  findCallDetails
}
