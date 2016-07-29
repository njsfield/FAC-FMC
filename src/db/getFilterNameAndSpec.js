module.exports = (dbClient, obj, done, cb) => {
  const queryArray = [obj.contact_id];
  dbClient.query('SELECT filter_name, filter_spec FROM filters WHERE contact_id=($1)', queryArray, (err, res) => {
    if (err) {
      cb(err);
    } else if (res.rowCount === 0) {
      cb(null, 'nothing was returned');
    } else {
      const arrFilter = res.rows;
      cb(null, arrFilter);
    }
  });
  done();
};
