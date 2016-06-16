const dbFetchCalls = require('../db/dbFetchCalls.js')
module.exports = {
  method: 'GET',
  path: '/fetch-calls/{user_id}/{company_id}',
  handler: (request, reply) => {
    // params = user, quantity
    const user_id = request.params.user_id
    const company_id = request.params.company_id
    const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc'
    dbFetchCalls.fetchCalls(user_id, company_id, postgresURL, (result) => {
      const calls = {
        calls: result
      }
      reply.view('dashboard', calls)
    })
  }
}
