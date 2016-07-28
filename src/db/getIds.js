const getTag_id = (dbClient, obj, done, cb) => {
  const queryArray = [obj.tag_name, obj.company_id];
  dbClient.query('SELECT tag_id FROM tags WHERE tag_name=($1) AND company_id=($2)', queryArray, (err, res) => {
    if (err) throw err;
    const boolKey = Object.keys(res.rows[0])[0];
    const tag_id = res.rows[0][boolKey];
    cb(tag_id);
  });
};

const getFilter_id = (dbClient, obj, done, cb) => {
  const queryArray = [obj.filter_name, obj.contact_id];
  dbClient.query('SELECT filter_id FROM filters WHERE filter_name=($1) AND contact_id=($2)', queryArray, (err, res) => {
    if (err) throw err;
    const boolKey = Object.keys(res.rows[0])[0];
    const filter_id = res.rows[0][boolKey];
    cb(filter_id);
  });
};

module.exports = {
  getTag_id,
  getFilter_id
};
