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
      console.log(result.rows)
      callback(result.rows)
    })
    done()
  })
}

module.exports = {
  fetchCalls,
  checkPartipicantsTable
}
