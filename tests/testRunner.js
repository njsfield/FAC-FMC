'use strict'
// Set up test database
const fs = require('fs')
const schema = require('../src/db/getSchema.js')
const connectionString = 'postgres://postgres:postgrespassword@localhost/fmctest'
const sql = fs.readFileSync(`${__dirname}/../src/db/db_schema.txt`).toString()
schema.getSchema(connectionString, sql)

// require in files
// require('./db/getID.test.js') //All functions tested and pass
// require('./db/db.tests.js')
// require('./db/fetchCalls.tests.js')
// require('./pollingTests/pollingDb.tests.js')
// require('./db/fetchAudio.tests.js')
// require('./pollingTests/polling.test.js')

require('./db/insertData.test.js')
