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

const restructureCallsResults = (data) => {
  let callArray = []

  data.forEach((callParticipant) => {
    let callObj = {
      participants: {},
      call_id: callParticipant.call_id,
      company_id: callParticipant.company_id
    }
    callParticipant.participant_role === 'SOURCE' ? callObj.participants.source = {
      number: callParticipant.number,
      internal: true,
      user: true
    } : callObj.participants.destination = {
      number: callParticipant.number,
      internal: true,
      user: true
    }
    callArray = callArray.concat([callObj])
  })
  return callArray
}

module.exports = {
  fetchCalls,
  checkPartipicantsTable,
  restructureCallsResults
}
