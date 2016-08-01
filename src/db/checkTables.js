const {insertIntoUsersTable, insertIntoTagsTable, insertIntoFiltersTable} = require('./insertData.js');

// this function checks to see if the user exists and returns the response object
const checkUsersTable = (dbClient, obj, done, cb) => {
  const queryArray = [obj.contact_id];
  dbClient.query('SELECT * FROM users WHERE contact_id=($1)', queryArray, (err, res) => {
    if (err) {
      cb(err);
    } else if (res.rowCount === 0) {
      insertIntoUsersTable(dbClient, obj, done, cb);
    } else {
      cb(null, res);
      done();
    }
  });
};

const checkTagsTable = (dbClient, obj, done, cb) => {
  const queryArray = [obj.tag_name, obj.company_id];
  dbClient.query('SELECT * FROM tags WHERE tag_name=($1) AND company_id=($2)', queryArray, (err, res) => {
    if (err) {
      throw err;
    } else if (res.rowCount === 0) {
      insertIntoTagsTable(dbClient, obj, done, cb);
    } else {
      cb(null, res);
      done();
    }
  });
};

const checkFiltersTable = (dbClient, obj, done, cb) => {
  const queryArray = [obj.filter_name, obj.contact_id];
  dbClient.query('SELECT * FROM filters WHERE filter_name=($1) AND contact_id=($2)', queryArray, (err, res) => {
    if (err) {
      cb(err);
    } else if (res.rowCount === 0) {
      insertIntoFiltersTable(dbClient, obj, done, cb);
    } else {
      cb(null, {
        success: false,
        message: 'filter name already exists'
      });
      done();
    }
  });
};

module.exports = {
  checkFiltersTable,
  checkTagsTable,
  checkUsersTable
};
