const dbFetchCalls = require('../db/dbFetchCalls.js')
module.exports = {
  method: 'GET',
  path: '/fetch-calls',
  handler: (request, reply) => {
    // params = user, quantity
    const user_id = '4387735'
    const company_id = '100'
    const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest'
    dbFetchCalls.fetchCalls(user_id, company_id, postgresURL, (result) => {
      reply(result)
    })
  }
}
