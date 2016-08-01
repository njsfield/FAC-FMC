
/**
 * Each function retrieves a unique ID from a table.
 * @param {object} dbClient - The postgres client server object.
 * @param {object} object - Data to be inserted into each function.
 * @param {function} callback - Returns unique ID.
 */
const getFile_id = (dbClient, obj, done, cb) => {
  const queryArray = [obj.file_name];
  dbClient.query('SELECT file_id FROM files WHERE file_name=($1)', queryArray, (err, res) => {
    if (err) {
      cb(err);
    } else {
      const file_id = res.rows[0].file_id;
      cb(null, file_id);

    }

  });
};

module.exports = {
  getFile_id,
};
