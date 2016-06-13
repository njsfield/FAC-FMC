const pg = require('pg')

const addCompany = (url, client, object, callback) => {
  client.query('INSERT INTO companies VALUES ($1)', [object.company_name], (error, response) => {
    if (error) throw error
    callback(response)
  })
}

module.exports = {
  addCompany
}
