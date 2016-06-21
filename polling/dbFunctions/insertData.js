//!!! refactor back ticks in queries!!!//

/**
 * Each function adds data to tables.
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
  dbClient.query(`SELECT TIMESTAMP WITH TIME ZONE 'epoch' + ${object.date} * INTERVAL '1' second`, (err, res) => {
    const objKey = Object.keys(res.rows[0]);
    const timestamp = res.rows[0][objKey];
    const queryArray = [timestamp, object.company_id, object.file_id, object.duration];
    dbClient.query('INSERT INTO calls (date, company_id, file_id, duration) VALUES ($1, $2, $3, $4)', queryArray, (error, response) => {
      if (error) throw error;
      callback(response);
    });
  });
};

const addToUsersTable = (dbClient, object, callback) => {
  const queryArray = [object.user_name, object.company_id, object.user_role];
  dbClient.query('INSERT INTO users (user_name, company_id, user_role) VALUES ($1, $2, $3)', queryArray, (error, response) => {
    if (error) throw error;
    callback(response);
  });
};

const addToParticipantsTable = (dbClient, object, callback) => {
  const queryArray = [object.call_id, object.company_id, object.number, object.internal, object.participant_role, object.user_id];
  dbClient.query('INSERT INTO participants (call_id, company_id, number, internal, participant_role, user_id) VALUES ($1, $2, $3, $4, $5, $6)', queryArray, (error, response) => {
    if (error) throw error;
    callback(response);
  });
};

const addToTagsTable = (dbClient, object, callback) => {
  const queryArray = [object.tag, object.user_id];
  dbClient.query('INSERT INTO tags (tag, company_id) VALUES ($1, (SELECT company_id FROM users WHERE user_id=$2))', queryArray, (error, response) => {
    if (error) throw error;
    callback(response);
  });
};

module.exports = {
  addToCompaniesTable,
  addToFilesTable,
  addToCallsTable,
  addToUsersTable,
  addToParticipantsTable,
  addToTagsTable
};
