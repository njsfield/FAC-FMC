  // Set up test database
  require('env2')('config.env');
  const fs = require('fs');
  const schema = require('../schema/getSchema.js');
  const connectionString = process.env.POSTGRES_URL_TEST;
  const sql = fs.readFileSync(`${__dirname}/../schema/schema.txt`).toString();

  schema.getSchema(connectionString, sql);
  console.log("---------------- HERE ---------------");
  //require in files

  //test server flow
  // require('./src/server/loginFlowSuccess.test.js'); //all functions tested and working
  // require('./src/server/loginFlowFail.test.js'); //all functions tested and working

  //polling db tests
  require('./polling/db/checkTablesExists.test.js'); //
  require('./polling/db/checkTables.test.js'); //
  require('./polling/db/insertData.test.js'); //
  require('./polling/db/getIds.test.js'); //
  require('./polling/db/updateData.test.js'); //

  //polling api tests
  require('./polling/api/calculatePollTimes.test.js');
  require('./polling/api/retrieveCallerDetails.js');
  require('./polling/api/retrieveCompanyCalls.js');
  require('./polling/api/retrieveWavFiles.js');
  // require('./polling/api/retrieveCompanyNames.js'); EMPTY

  //pollerflow tests
  require('./polling/helpers/updatePollTable.test.js');
  require('./polling/helpers/processCalls.test.js');

  //src db tests
  require('./src/db/insertData.test.js');
  require('./src/db/checkTables.test.js');
  require('./src/db/filterQueryStringCreator.test.js');
  require('./src/db/getTagNamesArr.test.js');
  require('./src/db/deleteTag.test.js');
  require('./src/db/getFilterNameAndSpec.test.js');
