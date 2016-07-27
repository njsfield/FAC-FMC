const deleteTag = (dbClient, obj, done, cb) => {
  const queryArray = [obj.call_id, obj.tag_id];
  dbClient.query('DELETE FROM tags_calls WHERE call_id=($1) AND tag_id=($2)', queryArray, (err, res) => {
    if (err) throw err;
    cb(res);
  });
  done();
};

module.exports = {
  deleteTag
};
