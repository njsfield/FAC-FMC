const getTagIdForDeletion = (dbClient, obj, cb) => {
  const queryArray = [obj.company_id, obj.tag_name];
  dbClient.query('SELECT tag_id FROM tags WHERE company_id=($1) AND tag_name=($2)', queryArray, (err, res) => {
    if (err) throw err;
    cb(res.rows[0].tag_id);
  });
};

module.exports = {
  getTagIdForDeletion
};
