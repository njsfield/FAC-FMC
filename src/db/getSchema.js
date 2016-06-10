const pg = require('pg')

const getSchema = (postgresURL, stringifiedSchema) => pg.connect(postgresURL, (err, client, done) => {
  if (err) throw err
  client.query(stringifiedSchema)
  done()
})

module.exports = {
  getSchema
}
