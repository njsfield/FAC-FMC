
/**
 * Each function adds data to tables. What is inserted by each function
 * is evident as a property of the object parameter.
 * @param {object} dbClient - The postgres client server object.
 * @param {object} object - Data to be inserted into each function.
 * @param {function} callback - Returns response.
 */

const addToCompaniesTable = (dbClient, object, callback) => {
  const queryArray = [object.company_name];
  dbClient.query('INSERT INTO companies (company_name) VALUES ($1)', queryArray, (error, response) => {
    if (error) throw error;
    callback(response);
  });
};

const addToFilesTable = (dbClient, object, callback) => {
  const queryArray = [object.file_name];
  dbClient.query('INSERT INTO files (file_name) VALUES ($1)', queryArray, (error, response) => {
    if (error) throw error;
    callback(response);
  });
};

const addToCallsTable = (dbClient, object, callback) => {
  const queryArray = [object.date];
  dbClient.query('SELECT TIMESTAMP WITH TIME ZONE \'epoch\' + ($1) * INTERVAL \'1\' second', queryArray, (err, res) => {
    const objKey = Object.keys(res.rows[0]);
    const timestamp = res.rows[0][objKey];
    const queryArray2 = [timestamp, object.company_id, object.file_id, object.duration];
    dbClient.query('INSERT INTO calls (date, company_id, file_id, duration) VALUES ($1, $2, $3, $4)', queryArray2, (error, response) => {
      if (error) throw error;
      callback(response);
    });
  });
};

const addToUsersTable = (dbClient, object, callback) => {
  const queryArray = [object.contact_id, object.company_id];
  dbClient.query('INSERT INTO users (contact_id, company_id) VALUES ($1, $2)', queryArray, (error, response) => {
    if (error) throw error;
    callback(response);
  });
};

const addToParticipantsTable = (dbClient, object, callback) => {
  const queryArray = [object.call_id, object.company_id, object.number, object.internal, object.participant_role, object.contact_id];
  dbClient.query('INSERT INTO participants (call_id, company_id, number, internal, participant_role, contact_id) VALUES ($1, $2, $3, $4, $5, $6)', queryArray, (error, response) => {
    if (error) throw error;
    callback(response);
  });
};

const addToTagsTable = (dbClient, object, callback) => {
  const queryArray = [object.tag_name, object.company_id];
  dbClient.query('INSERT INTO tags (tag_name, company_id) VALUES ($1, $2)', queryArray, (error, response) => {
    if (error) throw error;
    callback(response);
  });
};

const addToTagsCallsTable = (dbClient, object, callback) => {
  const queryArray = [object.call_id, object.tag_id];
  dbClient.query('INSERT INTO tags_calls (call_id, tag_id) VALUES ($1, $2)', queryArray, (error, response) => {
    if (error) throw error;
    callback(response);
  });
};

const addToFiltersTable = (dbClient, object, callback) => {
  const queryArray = [object.filter_name, object.contact_id, object.filter_spec];
  dbClient.query('INSERT INTO filters (filter_name, contact_id, filter_spec) VALUES ($1, $2, $3)', queryArray, (error, response) => {
    if (error) throw error;
    callback(response);
  });
};
//
// const editTagsTable = (dbClient, object, callback) => {
//   const queryArray = [object.tag_name, object.tag_id];
//   dbClient.query('UPDATE tags SET tag_name=$1 WHERE tag_id=$2', queryArray, (error, response) => {
//     if (error) throw error;
//     callback(response);
//   });
// };

module.exports = {
  addToCompaniesTable,
  addToFilesTable,
  addToCallsTable,
  addToUsersTable,
  addToParticipantsTable,
  addToTagsTable,
  addToTagsCallsTable,
  addToFiltersTable
  // editTagsTable
};
