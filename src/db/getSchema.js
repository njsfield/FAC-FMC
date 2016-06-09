const pg = require('pg')
const fs = require('fs')

const postgresURL = 'postgres://Rob:postgrespassword@localhost/template1'
const sql = fs.readFileSync(__dirname + '/schema.txt').toString()

const testing = () => pg.connect(postgresURL, (err, client, done) => {
  if (err) throw err
  client.query(sql)
  done()
})

module.exports = {
  testing
}
