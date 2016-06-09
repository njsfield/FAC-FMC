const pg = require('pg')
const fs = require('fs')

const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc'
const sql = fs.readFileSync(__dirname + '/schema.txt').toString()

const testing = () => pg.connect(postgresURL, (err, client, done) => {
  if (err) throw err
  client.query(sql)
  done()
})

module.exports = {
  testing
}
