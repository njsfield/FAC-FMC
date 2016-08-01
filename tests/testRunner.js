// Set up test database
require('env2')('config.env');
const fs = require('fs');
const schema = require('../schema/getSchema.js');
const connectionString = process.env.POSTGRES_URL_TEST;
const sql = fs.readFileSync(`${__dirname}/../schema/schema.txt`).toString();

schema.getSchema(connectionString, sql);

//require in files

//test server flow
// require('./src/server/loginFlowSuccess.test.js'); //all functions tested and working
// require('./src/server/loginFlowFail.test.js'); //all functions tested and working

//polling db tests
require('./polling/db/checkTablesExists.test.js'); //all bar checkTags tested and pass
require('./polling/db/checkTables.test.js'); //all bar checkTags tested and pass
// require('./polling/db/insertData.test.js'); //all tested and pass
// require('./polling/db/getIds.test.js'); //INCOMPLETE
// require('./polling/db/updateData.test.js'); //INCOMPLETE

//polling api tests
// require('./polling/api/calculatePollTimes.test.js');
// require('./polling/api/retrieveCallerDetails.js');
// require('./polling/api/retrieveCompanyCalls.js');
// require('./polling/api/retrieveWavFiles.js');
// require('./polling/api/retrieveCompanyNames.js'); EMPTY

//pollerflow tests
// require('./polling/helpers/updatePollTable.test.js');
// require('./polling/helpers/processCalls.test.js');

//src db tests
// require('./src/db/filterQueryStringCreator.test.js'); //all functions tested and working
// require('./src/db/getTagNamesArr.test.js'); //the one function is tested and working
// require('./src/db/deleteTag.test.js'); //the one function is tested and working
// require('./src/db/getTagIdForDeletion.test.js'); //the one function is tested and working
// require('./src/db/getFilterNameAndSpec.test.js'); //the one function is tested and working
// require('./src/auth/checkCallerIdentification.test.js'); EMPTY
