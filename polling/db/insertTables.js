const pg = require('pg')

const addCompany = (connectionString, data) => {
  pg.connect(connectionString, (err, client, done) => {
    if (err) throw err
    client.query('INSERT INTO companies VALUES ($1)', [data.company_name])
    done()
  })
}

module.exports = {
  addCompany
}
