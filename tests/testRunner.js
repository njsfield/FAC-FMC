// Set up test database
require('env2')('config.env');
const fs = require('fs');
const schema = require('../src/db/getSchema.js');
const connectionString = 'postgres://postgres:postgrespassword@localhost/fmctest';
const sql = fs.readFileSync(`${__dirname}/../schema.txt`).toString();
schema.getSchema(connectionString, sql);

// require('./polling/db/checkTablesExists.test.js'); //all bar checkTags tested and pass
// require('./polling/db/checkTables.test.js'); //all bar checkTags tested and pass
// require('./polling/db/insertData.test.js'); //all tested and pass
// require('./polling/db/getIds.test.js'); //All functions tested and pass
// require('./polling/api/pollingCalls.test.js');
// require('./polling/api/calculatePollTimes.test.js');

// require('./polling/db/updateData.test.js'); //all tested and

    // require in files
require('./src/db/filterQueryStringCreator.test.js'); //all functions tested and working
require('./src/db/getTagNamesArr.test.js'); //the one function is tested and working
require('./src/db/deleteTag.test.js'); //the one function is tested and working
require('./src/db/getTagIdForDeletion.test.js'); //the one function is tested and working
require('./src/db/getFilterNameAndSpec.test.js'); //the one function is tested and working
require('./src/server/loginFlowSuccess.test.js'); //all functions tested and working
require('./src/server/loginFlowFail.test.js'); //all functions tested and working
