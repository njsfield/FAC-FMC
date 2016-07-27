const getFilterTagNamesArr = (dbClient, obj, done, cb) => {
  const queryArray = [obj.company_id];
  dbClient.query('SELECT tag_name, tag_id FROM tags WHERE company_id=($1)', queryArray, (err, res) => {
    if (err) throw err;
    if (res.rowCount === 0) {
      cb('no tags');
    } else {
      const arrTags = res.rows;
      cb(arrTags);
    }
  });
  done();
};

module.exports = {
  getFilterTagNamesArr
};
