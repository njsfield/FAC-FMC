// Set up test database
const fs = require('fs');
const schema = require('../src/db/getSchema.js');
const connectionString = 'postgres://postgres:postgrespassword@localhost/fmctest';
const sql = fs.readFileSync(`${__dirname}/../src/db/db_schema.txt`).toString();
schema.getSchema(connectionString, sql);

// // require in files
require('./db/db.tests.js');
require('./db/getID.test.js'); //All functions tested and pass
require('./db/insertData.test.js'); //all bar tags tested and pass
require('./db/checkTable.test.js'); //all bar checkTags tested and pass
// require('./db/pollerFlow.test.js') //nothing is tested at all at the moment
// require('./db/fetchCalls.tests.js')
// require('./db/fetchAudio.tests.js')
// require('./pollingTests/polling.test.js')
