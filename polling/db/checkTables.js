const {insertIntoParticipantsTable, insertIntoCompaniesTable, insertIntoFilesTable, insertIntoCallsTable, insertIntoUsersTable, insertIntoTagsTable, insertIntoFiltersTable } = require('./insertData.js');

/**
 * Each function checks a table for specific data. What is checked for in each function
 * is evident as a property of the object parameter. If checked for data is absent,
 * functions from insertData.js are called to insert it.
 * @param {object} dbClient - The postgres client server object.
 * @param {object} object - Data to be inserted into each function.
 * @param {function} callback - Returns response.
 */

const checkCompaniesTable = (dbClient, obj, done, cb) => {
  const queryArray = [obj.company_name];
  dbClient.query('SELECT * FROM companies WHERE company_name=($1)', queryArray, (err, res) => {
    if (err) throw err;
    if (res.rowCount === 0) {
      insertIntoCompaniesTable(dbClient, obj, done, () => {
        checkCompaniesTable(dbClient, obj, done, cb);
      });
    } else {
      cb(res.rows[0].company_id);
    }
    done();
  });
};

// this function checks the file table and returns a file_id if it exists. If it doesn't then it
// adds the file and then returns the file_id
const checkFilesTable = (dbClient, obj, done, cb) => {
  const queryArray = [obj.file_name];
  dbClient.query('SELECT * FROM files WHERE file_name=($1)', queryArray, (err, res) => {
    if (err) throw err;
    if (res.rowCount === 0) {
      insertIntoFilesTable(dbClient, obj, done, cb);
    } else {
      cb(res.rows[0].file_id, res.command);
    }
  });
};

// this function checks the calls table and returns a call_id if it exists. If it doesn't then it
// adds the call and then returns the call_id
const checkCallsTable = (dbClient, obj, done, cb) => {
  const queryArray = [obj.company_id, obj.file_id];
  dbClient.query('SELECT * FROM calls WHERE company_id=($1) AND file_id=($2)', queryArray, (err, res) => {
    if (err) throw err;
    if (res.rowCount === 0) {
      insertIntoCallsTable(dbClient, obj, done, () => {
        checkCallsTable(dbClient, obj, done, cb);
      });
    } else {
      cb(res.rows[0].call_id);
    }
  });
};

// this function checks to see if the user exists and returns the response object
const checkUsersTable = (dbClient, obj, done, cb) => {
  const queryArray = [obj.contact_id];
  dbClient.query('SELECT * FROM users WHERE contact_id=($1)', queryArray, (err, res) => {
    if (err) throw err;
    console.log(res.rowCount, 'called');
    if (res.rowCount === 0) {
      insertIntoUsersTable(dbClient, obj, done, cb);
    } else {
      cb(res);
    }
  });
};

// if participants exist in the participants table it returns null
// if participants dont, it returns the number
const checkParticipantsTable = (dbClient, obj, done, cb) => {

  const queryArray = [obj.call_id, obj.company_id, obj.contact_id];
  dbClient.query('SELECT * FROM participants WHERE call_id=($1) AND company_id=($2) AND contact_id=($3)', queryArray, (err, res) => {
    if (err) throw err;
    if (res.rowCount === 0) {
      insertIntoParticipantsTable(dbClient, obj, done, () => {
      }) ;
      cb(obj.number);
    } else {
      cb(null);
    }
  });
};

const checkLastPollTable = (dbClient, obj, done, cb) => {
  const queryArray = [obj.company_id];
  dbClient.query('select extract (epoch FROM last_poll) from last_polls WHERE company_id=($1)', queryArray, (err, res) => {
    if (err) throw err;
    if (res.rowCount === 0) {
      cb(null);
    } else {
      cb(res.rows[0].date_part * 1000);
    }
  });
};

module.exports = {
  checkFilesTable,
  checkCompaniesTable,
  checkCallsTable,
  checkUsersTable,
  checkParticipantsTable,
  checkLastPollTable
};
