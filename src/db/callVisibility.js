module.exports = (dbClient, obj, cb) => {
  const queryArray = [obj.call_id, obj.contact_id];
  dbClient.query('UPDATE participants SET hidden =  NOT hidden WHERE call_id=$1 AND contact_id=$2 RETURNING hidden;', queryArray, (err, res) => {
    if (err) {
      cb(err);
    }
    else if (res.rowCount === 0) {
      cb(null, 'Does not exist in table');
    } else {
      console.log("RETURNED DATA: ", res);
      cb(null, res.rows[0].hidden);
    }
  });
};
