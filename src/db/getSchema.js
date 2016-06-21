const pg = require('pg');

/** Reads the schema and populates the database when called. */

const getSchema = (postgresURL, stringifiedSchema) => pg.connect(postgresURL, (err, client, done) => {
  if (err) throw err;
  client.query(stringifiedSchema);
  done();
});

module.exports = {
  getSchema
};
