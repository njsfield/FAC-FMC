const getTagIdForDeletion = (dbClient, obj, done, cb) => {
  const queryArray = [obj.company_id, obj.tag_name];
  dbClient.query('SELECT tag_id FROM tags WHERE company_id=($1) AND tag_name=($2)', queryArray, (err, res) => {
    if (err) throw err;
    if (res.rowCount === 0) {
      cb('doesn\'t exist');
    } else {
      cb(res.rows[0].tag_id);
    }
  });
  done();
};

module.exports = {
  getTagIdForDeletion
};
