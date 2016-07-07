// Set up test database
require('env2')('config.env');
const fs = require('fs');
const schema = require('../src/db/getSchema.js');
const connectionString = 'postgres://postgres:postgrespassword@localhost/fmctest';
const sql = fs.readFileSync(`${__dirname}/../schema.txt`).toString();
schema.getSchema(connectionString, sql);

// // require in files
require('./polling/db/checkTablesExists.test.js'); //all bar checkTags tested and pass
require('./polling/db/insertData.test.js'); //all tested and pass
require('./polling/db/getIds.test.js'); //All functions tested and pass
require('./polling/db/getFilterNameAndSpec.test.js'); //All functions tested and pass
require('./polling/db/checkTables.test.js'); //all bar checkTags tested and pass
require('./polling/api/pollingCalls.test.js');
require('./src/db/fetchCalls.test.js');
// require('./src/db/filterQueryStringCreator.test.js');
require('./src/db/fetchAudio.test.js');
require('./src/server/loginFlowSuccess.test.js');
require('./src/server/loginFlowFail.test.js');
