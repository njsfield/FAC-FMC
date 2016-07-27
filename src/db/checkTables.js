const {insertIntoTagsTable, insertIntoFiltersTable } = require('./insertData.js');

const checkTagsTable = (dbClient, obj, done, cb) => {
  const queryArray = [obj.tag_name, obj.company_id];
  dbClient.query('SELECT EXISTS (SELECT * FROM tags WHERE tag_name=($1) AND company_id=($2))', queryArray, (err, res) => {
    if (err) throw err;
    const boolKey = Object.keys(res.rows[0])[0];
    if (res.rows[0][boolKey] === false) {
      insertIntoTagsTable(dbClient, obj, done, cb);
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
      insertIntoFiltersTable(dbClient, obj, done, cb);
    } else {
      cb({
        success: false,
        message: 'filter name already exists'
      });
    }
  });
};

module.exports = {
  checkFiltersTable,
  checkTagsTable
};
