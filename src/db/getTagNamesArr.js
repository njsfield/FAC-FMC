const getFilterTagNamesArr = (dbClient, obj, cb) => {
  const queryArray = [obj.company_id];
  dbClient.query('SELECT tag_name, tag_id FROM tags WHERE company_id=($1)', queryArray, (err, res) => {
    if (err) throw err;
    const arrTags = res.rows;
    cb(arrTags);
  });
};

module.exports = {
  getFilterTagNamesArr
};
