const getTag_id = (dbClient, obj, cb) => {
  const queryArray = [obj.company_id, obj.tag_name];
  dbClient.query('SELECT tag_id FROM tags WHERE company_id=($1) AND tag_name=($2)', queryArray, (err, res) => {
    if (err) {
      cb(err);
    } else if (res.rowCount === 0) {
      cb(null, 'doesn\'t exist');
    } else {
      cb(null, res.rows[0].tag_id);
    }
  });
};

module.exports = {
  getTag_id,
};
