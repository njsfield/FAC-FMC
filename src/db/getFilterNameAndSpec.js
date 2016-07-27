module.exports = (dbClient, obj, done, cb) => {
  const queryArray = [obj.contact_id];
  dbClient.query('SELECT filter_name, filter_spec FROM filters WHERE contact_id=($1)', queryArray, (err, res) => {
    if (err) throw err;
    if (res.rowCount === 0) {
      cb('nothing was returned');
    } else {
      const arrFilter = res.rows;
      cb(arrFilter);
    }
  });
  done();
};
