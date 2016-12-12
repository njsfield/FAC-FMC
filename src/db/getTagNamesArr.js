module.exports = (dbClient, obj, limit, cb) => {
  const queryArray = [obj.company_id, limit];
  dbClient.query('SELECT tag_name, tag_id FROM popular_tags WHERE company_id=($1) ORDER BY refs ASC LIMIT $2', queryArray, (err, res) => {
    if (err) {
      cb(err);
    } else if (res.rowCount === 0) {
      cb(null, '');
    } else {
      const arrTags = res.rows;
      cb(null, arrTags);
    }
  });
};
