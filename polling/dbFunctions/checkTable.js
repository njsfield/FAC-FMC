const insertData = require('./insertData.js');

/**
 * Each function checks a table for specific data. What is checked for in each function
 * is evident as a property of the object parameter. If checked for data is absent,
 * functions from insertData.js are called to insert it.
 * @param {object} dbClient - The postgres client server object.
 * @param {object} object - Data to be inserted into each function.
 * @param {function} callback - Returns response.
 */

const checkCompaniesTable = (dbClient, obj, cb) => {
  const queryArray = [obj.company_name];
  dbClient.query('SELECT EXISTS (SELECT * FROM companies WHERE company_name=($1))', queryArray, (err, res) => {
    if (err) throw err;
    const boolKey = Object.keys(res.rows[0])[0];
    if (res.rows[0][boolKey] === false) {
      insertData.addToCompaniesTable( dbClient, obj, cb);
    } else {
      cb(res);
    }
  });
};

const checkFilesTable = (dbClient, obj, cb) => {
  const queryArray = [obj.file_name];
  dbClient.query('SELECT EXISTS (SELECT * FROM files WHERE file_name=($1))', queryArray, (err, res) => {
    if (err) throw err;
    const boolKey = Object.keys(res.rows[0])[0];
    if (res.rows[0][boolKey] === false) {
      insertData.addToFilesTable(dbClient, obj, cb);
    } else {
      cb(res);

    }
  });
};

const checkCallsTable = (dbClient, obj, cb) => {
  const queryArray = [obj.company_id, obj.file_id];
  dbClient.query('SELECT EXISTS (SELECT * FROM calls WHERE company_id=($1) AND file_id=($2))', queryArray, (err5, res5) => {
    if (err5) throw err5;
    const boolKey5 = Object.keys(res5.rows[0])[0];
    if (res5.rows[0][boolKey5] === false) {
      insertData.addToCallsTable(dbClient, obj, cb);
    } else {
      cb(res5);
    }
  });
};

const checkUsersTable = (dbClient, obj, cb) => {
  const queryArray = [obj.contact_id];
  dbClient.query('SELECT EXISTS (SELECT * FROM users WHERE contact_id=($1))', queryArray, (err, res) => {
    if (err) throw err;
    const boolKey = Object.keys(res.rows[0])[0];
    if (res.rows[0][boolKey] === false) {
      insertData.addToUsersTable(dbClient, obj, cb);
    } else {
      cb(res);
    }
  });
};

const checkParticipantsTable = (dbClient, obj, cb) => {
  const queryArray = [obj.call_id, obj.company_id, obj.contact_id];
  dbClient.query('SELECT EXISTS (SELECT * FROM participants WHERE call_id=($1) AND company_id=($2) AND contact_id=($3))', queryArray, (err, res) => {
    if (err) throw err;
    const boolKey = Object.keys(res.rows[0])[0];
    if (res.rows[0][boolKey] === false) {
      insertData.addToParticipantsTable(dbClient, obj, cb);
    } else {
      cb(res);
    }
  });
};

const checkTagsTable = (dbClient, obj, cb) => {
  const queryArray = [obj.tag_name, obj.company_id];
  dbClient.query('SELECT EXISTS (SELECT * FROM tags WHERE tag_name=($1) AND company_id=($2))', queryArray, (err, res) => {
    if (err) throw err;
    const boolKey = Object.keys(res.rows[0])[0];
    if (res.rows[0][boolKey] === false) {
      insertData.addToTagsTable(dbClient, obj, cb);
    } else {
      cb(res);
    }
  });
};

module.exports = {
  checkFilesTable,
  checkCompaniesTable,
  checkCallsTable,
  checkUsersTable,
  checkParticipantsTable,
  checkTagsTable
};
