module.exports = (dbClient, obj, cb) => {
  const queryArray = [obj.company_id];
  dbClient.query('SELECT tag_name, tag_id FROM tags WHERE company_id=($1)', queryArray, (err, res) => {
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
