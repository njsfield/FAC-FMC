const insertIntoUsersTable = (dbClient, object, done, callback) => {
  const queryArray = [object.contact_id, object.company_id];
  dbClient.query('INSERT INTO users (contact_id, company_id) VALUES ($1, $2)', queryArray, (error, response) => {
    if (error) {
      callback(error);
    } else {
      callback(null, response);
    }
  });
  done();
};

const insertIntoTagsTable = (dbClient, object, done, callback) => {
  const queryArray = [object.tag_name, object.company_id];
  dbClient.query('INSERT INTO tags (tag_name, company_id) VALUES ($1, $2)', queryArray, (error, response) => {
    if (error) {
      callback(error);
    }
    callback(null, response);
  });
  done();
};

const insertIntoTagsCallsTable = (dbClient, object, done, callback) => {
  const queryArray = [object.call_id, object.tag_id];
  dbClient.query('INSERT INTO tags_calls (call_id, tag_id) VALUES ($1, $2)', queryArray, (error, response) => {
    if (error) {
      callback(error);
    } else {
      callback(null, response);
    }
  });
  done();
};

const insertIntoFiltersTable = (dbClient, object, done, callback) => {
  const queryArray = [object.filter_name, object.contact_id, object.filter_spec];
  if (object.filter_spec.duration_min === 0) {
    object.filter_spec.duration_min = '';
  }

  if (object.filter_spec.duration_max === 0) {
    object.filter_spec.duration_max = '';
  }

  dbClient.query('INSERT INTO filters (filter_name, contact_id, filter_spec) VALUES ($1, $2, $3)', queryArray, (error) => {
    if (error) {
      callback(error);
    }
    callback(null,
      {
        success: true
      });
  });
  done();
};

module.exports = {
  insertIntoTagsCallsTable,
  insertIntoFiltersTable,
  insertIntoUsersTable,
  insertIntoTagsTable
};
