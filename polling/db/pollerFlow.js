/** Refactoring needed! */

const checkTables = require('./checkTables.js');
const getIds = require('./getIds.js');

/** Calls all functions involved in the poller flow. */

const pollerFlow = (dbClient, done, obj, cb) => {
  checkTables.checkFilesTable(dbClient, obj, () => {
    done();
    getIds.getCompany_id(dbClient, obj, (company_id) => {
      done();
      obj.company_id = company_id;
      getIds.getFile_id(dbClient, obj, (file_id) => {
        done();
        obj.file_id = file_id;
        checkTables.checkCallsTable(dbClient, obj, (res) => {
          done();
          getIds.getCall_id(dbClient, obj, (call_id) => {
            done();
            obj.call_id = call_id;
            cb(res);
          });
        });
      });
    });
  });
};

module.exports = {
  pollerFlow
};
