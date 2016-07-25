const insertData = require('./insertData.js');

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
      insertData.insertIntoCompaniesTable(dbClient, obj, done, () => {
        checkCompaniesTable(dbClient, obj, done, cb);
      });
    } else {
      cb(res.rows[0].company_id);
    }
    done();
  });
};

const checkFilesTable = (dbClient, obj, done, cb) => {
  const queryArray = [obj.file_name];
  dbClient.query('SELECT * FROM files WHERE file_name=($1)', queryArray, (err, res) => {
    if (err) throw err;
    if (res.rowCount === 0) {
      insertData.insertIntoFilesTable(dbClient, obj, done, cb);
    } else {
      cb(res.rows[0].file_id, res.command);
    }
  });
};

const checkCallsTable = (dbClient, obj, done, cb) => {
  const queryArray = [obj.company_id, obj.file_id];
  dbClient.query('SELECT * FROM calls WHERE company_id=($1) AND file_id=($2)', queryArray, (err, res) => {
    if (err) throw err;
    if (res.rowCount === 0) {
      insertData.insertIntoCallsTable(dbClient, obj, done, () => {
        checkCallsTable(dbClient, obj, done, cb);
      });
    } else {
      cb(res.rows[0].call_id);
    }
  });
};

const checkUsersTable = (dbClient, obj, done, cb) => {
  const queryArray = [obj.contact_id];
  dbClient.query('SELECT EXISTS (SELECT * FROM users WHERE contact_id=($1))', queryArray, (err, res) => {
    if (err) throw err;
    const boolKey = Object.keys(res.rows[0])[0];
    if (res.rows[0][boolKey] === false) {
      insertData.insertIntoUsersTable(dbClient, obj, done, cb);
    } else {
      cb(res);
    }
  });
};

const checkParticipantsTable = (dbClient, obj, done, cb) => {
  const queryArray = [obj.call_id, obj.company_id, obj.contact_id];
  dbClient.query('SELECT EXISTS (SELECT * FROM participants WHERE call_id=($1) AND company_id=($2) AND contact_id=($3))', queryArray, (err, res) => {
    if (err) throw err;
    const boolKey = Object.keys(res.rows[0])[0];
    if (res.rows[0][boolKey] === false) {
      insertData.insertIntoParticipantsTable(dbClient, obj, done, cb);
    } else {
      cb(res);
    }
  });
};

const checkTagsTable = (dbClient, obj, done, cb) => {
  const queryArray = [obj.tag_name, obj.company_id];
  dbClient.query('SELECT EXISTS (SELECT * FROM tags WHERE tag_name=($1) AND company_id=($2))', queryArray, (err, res) => {
    if (err) throw err;
    const boolKey = Object.keys(res.rows[0])[0];
    if (res.rows[0][boolKey] === false) {
      insertData.insertIntoTagsTable(dbClient, obj, done, cb);
    } else {
      cb(res);
    }
  });
};

const checkFiltersTable = (dbClient, obj, done, cb) => {
  const queryArray = [obj.filter_name, obj.contact_id];
  dbClient.query('SELECT EXISTS (SELECT * FROM filters WHERE filter_name=($1) AND contact_id=($2))', queryArray, (err, res) => {
    if (err) throw err;
    const boolKey = Object.keys(res.rows[0])[0];
    if (res.rows[0][boolKey] === false) {
      insertData.insertIntoFiltersTable(dbClient, obj, done, cb);
    } else {
      cb({
        success: false,
        message: 'filter name already exists'
      });
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
      cb(res.rows[0] * 1000);
    }
  });
};

module.exports = {
  checkFilesTable,
  checkCompaniesTable,
  checkCallsTable,
  checkUsersTable,
  checkParticipantsTable,
  checkTagsTable,
  checkFiltersTable,
  checkLastPollTable
};
