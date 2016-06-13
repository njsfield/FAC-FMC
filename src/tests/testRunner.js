
// Set up test database
const fs = require('fs')
const schema = require('../db/getSchema.js')
const connectionString = 'postgres://postgres:postgrespassword@localhost/fmctest'
const sql = fs.readFileSync(`${__dirname}/../db/db_schema.txt`).toString()
schema.getSchema(connectionString, sql)

// require in files

require('./server.tests.js')
require('./db/fetchCalls.tests.js')
