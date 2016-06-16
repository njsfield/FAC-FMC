const dbFetchCalls = require('../db/dbFetchCalls.js')
const pg = 'pg'
module.exports = {
  method: 'GET',
  path: '/dashboard/{user_id}/{company_id}',
  handler: (request, reply) => {
    const user_id = request.params.user_id
    const company_id = request.params.company_id
    const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc'
    pg.connect(postgresURL, (err, client, done) => {
      if (err) throw err
      dbFetchCalls.fetchCalls(client, done, user_id, company_id, (result) => {
        const calls = {
          calls: result
        }
        reply.view('dashboard', calls)
      })
    })
  }
}
