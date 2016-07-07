const getFilter_name = (dbClient, obj, cb) => {
  const queryArray = [obj.contact_id];
  dbClient.query('SELECT filter_name FROM filters WHERE contact_id=($1)', queryArray, (err, res) => {
    if (err) throw err;
    const arrFilter_name = res.rows;
    cb(arrFilter_name);
  });
};

module.exports = {
  getFilter_name
};
