const getTag_id = (dbClient, obj, done, cb) => {
  const queryArray = [obj.tag_name, obj.company_id];
  dbClient.query('SELECT tag_id FROM tags WHERE tag_name=($1) AND company_id=($2)', queryArray, (err, res) => {
    if (err) {
      cb(err);
    } else {
      const boolKey = Object.keys(res.rows[0])[0];
      const tag_id = res.rows[0][boolKey];
      cb(null, tag_id);
    }
  });
};

module.exports = {
  getTag_id,
};
