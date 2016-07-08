const getFilterNameAndFilterSpec = (dbClient, obj, cb) => {
  const queryArray = [obj.contact_id];
  dbClient.query('SELECT filter_name, filter_spec FROM filters WHERE contact_id=($1)', queryArray, (err, res) => {
    if (err) throw err;
    const arrFilter = res.rows;
    cb(arrFilter);
  });
};

module.exports = {
  getFilterNameAndFilterSpec
};
