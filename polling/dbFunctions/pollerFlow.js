/** Refactoring needed! */

const checkTable = require('./checkTable.js');
const getID = require('./getID.js');

/** Calls all functions involved in the poller flow. */

const pollerFlow = (cli, done, obj, cb) => {
  checkTable.checkFilesTable(cli, obj, () => {
    done();
    getID.getCompany_id(cli, obj, (company_id) => {
      done();
      obj.company_id = company_id;
      getID.getFile_id(cli, obj, (file_id) => {
        done();
        obj.file_id = file_id;
        checkTable.checkCallsTable(cli, obj, (res) => {
          done();
          getID.getCall_id(cli, obj, (call_id) => {
            done();
            obj.call_id = call_id;
            cb(res);
          });
        });
      });
    });
  });
};

/** Checks the user_table for user_id. */

const continuedPollerFlow = (cli, done, obj, cb) => {
  checkTable.checkUsersTable(cli, obj, () => {
    done();
    getID.getUser_id(cli, obj, (res) => {
      cb(res);
      done();
    });
  });
};

module.exports = {
  pollerFlow,
  continuedPollerFlow
};
