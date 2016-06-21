const insertData = require('./insertData.js');

//functions to check a table for a specfic bit of data.
//If said data is not in the table functions are called to insert it
const checkCompaniesTable = (cli, obj, cb) => {
  const queryArray = [obj.company_name];
  cli.query('SELECT EXISTS (SELECT * FROM companies WHERE company_name=($1))', queryArray, (err, res) => {
    if (err) throw err;
    const boolKey = Object.keys(res.rows[0])[0];
    if (res.rows[0][boolKey] === false) {
      insertData.addToCompaniesTable( cli, obj, cb);
    } else {
      cb(res);
    }
  });
};

const checkFilesTable = (cli, obj, cb) => {
  const queryArray = [obj.file_name];
  cli.query('SELECT EXISTS (SELECT * FROM files WHERE file_name=($1))', queryArray, (err, res) => {
    if (err) throw err;
    const boolKey = Object.keys(res.rows[0])[0];
    if (res.rows[0][boolKey] === false) {
      insertData.addToFilesTable(cli, obj, cb);
    } else {
      cb(res);

    }
  });
};

const checkCallsTable = (cli, obj, cb) => {
  const queryArray = [obj.company_id, obj.file_id];
  cli.query('SELECT EXISTS (SELECT * FROM calls WHERE company_id=($1) AND file_id=($2))', queryArray, (err5, res5) => {
    if (err5) throw err5;
    const boolKey5 = Object.keys(res5.rows[0])[0];
    if (res5.rows[0][boolKey5] === false) {
      insertData.addToCallsTable(cli, obj, cb);
    } else {
      cb(res5);
    }
  });
};

const checkUsersTable = (cli, obj, cb) => {
  const queryArray = [obj.user_name];
  cli.query('SELECT EXISTS (SELECT * FROM users WHERE user_name=($1))', queryArray, (err, res) => {
    if (err) throw err;
    const boolKey = Object.keys(res.rows[0])[0];
    if (res.rows[0][boolKey] === false) {
      insertData.addToUsersTable(cli, obj, cb);
    } else {
      cb(res);
    }
  });
};

const checkParticipantsTable = (cli, obj, cb) => {
  const queryArray = [obj.call_id, obj.company_id, obj.user_id];
  cli.query('SELECT EXISTS (SELECT * FROM participants WHERE call_id=($1) AND company_id=($2) AND user_id=($3))', queryArray, (err, res) => {
    if (err) throw err;
    const boolKey = Object.keys(res.rows[0])[0];
    if (res.rows[0][boolKey] === false) {
      insertData.addToParticipantsTable(cli, obj, cb);
    } else {
      cb(res);
    }
  });
};

const checkTagsTable = (url, cli, obj, cb) => {
  const queryArray = [obj.tag, obj.user_id];
  cli.query('SELECT EXISTS (SELECT * FROM tags WHERE tag=($1) AND company_id=((SELECT company_id FROM users WHERE user_id=($2))))', queryArray, (err, res) => {
    if (err) throw err;
    const boolKey = Object.keys(res.rows[0])[0];
    if (res.rows[0][boolKey] === false) {
      insertData.addToTagsTable(url, cli, obj, cb);
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
