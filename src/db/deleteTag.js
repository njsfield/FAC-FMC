module.exports = (dbClient, obj, cb) => {
  const queryArray = [obj.call_id, obj.tag_id];
  dbClient.query('DELETE FROM tags_calls WHERE call_id=($1) AND tag_id=($2)', queryArray, (err, res) => {
    if (err) {
      cb(err);
    }
    else if (res.rowCount === 0) {
      cb(null, 'Does not exist in table');
    } else {
      cb(null, res);
    }
  });
};
