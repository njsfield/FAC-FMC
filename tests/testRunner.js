'use strict'
// Set up test database
const fs = require('fs')
const schema = require('../src/db/getSchema.js')
const connectionString = 'postgres://postgres:postgrespassword@localhost/fmctest'
const sql = fs.readFileSync(`${__dirname}/../src/db/db_schema.txt`).toString()
schema.getSchema(connectionString, sql)

// require in files
require('./db/db.tests.js')
require('./db/fetchCalls.tests.js')
require('./pollingTests/pollingDb.tests.js')
