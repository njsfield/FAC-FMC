
/**
 * Each function retrieves a unique ID from a table.
 * @param {object} dbClient - The postgres client server object.
 * @param {object} object - Data to be inserted into each function.
 * @param {function} callback - Returns unique ID.
 */

const getCompany_id = (dbClient, obj, cb) => {
  const queryArray = [obj.company_name];
  dbClient.query('SELECT company_id FROM companies WHERE company_name=($1)', queryArray, (err, res) => {
    if (err) throw err;
    const boolKey = Object.keys(res.rows[0]);
    const company_id = res.rows[0][boolKey];
    cb(company_id);
  });
};

const getFile_id = (dbClient, obj, cb) => {
  const queryArray = [obj.file_name];
  dbClient.query('SELECT file_id FROM files WHERE file_name=($1)', queryArray, (err, res) => {
    if (err) throw err;
    const boolKey = Object.keys(res.rows[0])[0];
    const file_id = res.rows[0][boolKey];
    cb(file_id);
  });
};

const getCall_id = (dbClient, obj, cb) => {
  const queryArray = [obj.company_id, obj.file_id];
  dbClient.query('SELECT call_id FROM calls WHERE company_id=($1) AND file_id=($2)', queryArray, (err, res) => {
    if (err) throw err;
    const boolKey = Object.keys(res.rows[0])[0];
    const call_id = res.rows[0][boolKey];
    cb(call_id);
  });
};

const getTag_id = (dbClient, obj, cb) => {
  const queryArray = [obj.tag_name, obj.company_id];
  dbClient.query('SELECT tag_id FROM tags WHERE tag_name=($1) AND company_id=($2)', queryArray, (err, res) => {
    if (err) throw err;
    const boolKey = Object.keys(res.rows[0])[0];
    const tag_id = res.rows[0][boolKey];
    cb(tag_id);
  });
};

module.exports = {
  getCompany_id,
  getFile_id,
  getCall_id,
  getTag_id
};
