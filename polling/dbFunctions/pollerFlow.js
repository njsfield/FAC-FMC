/** Refactoring needed! */

const checkTable = require('./checkTable.js');
const getID = require('./getID.js');

/** Calls all functions involved in the poller flow. */

const pollerFlow = (dbClient, done, obj, cb) => {
  checkTable.checkFilesTable(dbClient, obj, () => {
    done();
    getID.getCompany_id(dbClient, obj, (company_id) => {
      done();
      obj.company_id = company_id;
      getID.getFile_id(dbClient, obj, (file_id) => {
        done();
        obj.file_id = file_id;
        checkTable.checkCallsTable(dbClient, obj, (res) => {
          done();
          getID.getCall_id(dbClient, obj, (call_id) => {
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
