const getCompany_id = require('./getIds.js').getCompany_id;
const getFile_id = require('./getIds.js').getFile_id;

/**
 * Each function adds data to tables. What is inserted by each function
 * is evident as a property of the object parameter.
 * @param {object} dbClient - The postgres client server object.
 * @param {object} object - Data to be inserted into each function.
 * @param {function} callback - Returns response.
 */

const insertIntoCompaniesTable = (dbClient, object, done, callback) => {
  const queryArray = [object.company_name];
  dbClient.query('INSERT INTO companies (company_name) VALUES ($1)', queryArray, (error, res) => {
    if (error) throw error;
    callback(res.command);
  });
  done();
};
// insert into Files table returns file_id of the file and the command so that we know
// in the poller flow whether to retrieve the file from the wav table
const insertIntoFilesTable = (dbClient, object, done, callback) => {
  const queryArray = [object.file_name];
  dbClient.query('INSERT INTO files (file_name) VALUES ($1)', queryArray, (error, res) => {
    if (error) throw error;
    getFile_id(dbClient, object, done, (file_id) => {
      callback(file_id, res.command);
    });
    done();
  });
};

const insertIntoCallsTable = (dbClient, object, done, callback) => {
  const queryArray2 = [object.date, object.company_id, object.file_id, object.duration];
  dbClient.query('INSERT INTO calls (date, company_id, file_id, duration) VALUES ((TO_TIMESTAMP($1)), $2, $3, $4)', queryArray2, (error, response) => {
    if (error) throw error;
    callback(response);
  });
  done();
};

const insertIntoParticipantsTable = (dbClient, object, done, callback) => {
  const queryArray = [object.call_id, object.company_id, object.number, object.internal, object.participant_role, object.contact_id];
  dbClient.query('INSERT INTO participants (call_id, company_id, number, internal, participant_role, contact_id) VALUES ($1, $2, $3, $4, $5, $6)', queryArray, (error, response) => {
    if (error) throw error;
    callback(response);
  });
};

const insertIntoLastPollTable = (dbClient, object, done, callback) => {
  const queryArray = [object.last_poll/1000, object.company_id];
  dbClient.query('INSERT INTO last_polls (last_poll, company_id) VALUES ((TO_TIMESTAMP($1) at time zone \'UTC\'), $2)', queryArray, (error, response) => {
    if (error) throw error;
    callback(response);
  });
};
//
// const editTagsTable = (dbClient, object, done, callback) => {
//   const queryArray = [object.tag_name, object.tag_id];
//   dbClient.query('UPDATE tags SET tag_name=$1 WHERE tag_id=$2', queryArray, (error, response) => {
//     if (error) throw error;
//     callback(response);
//   });
// };

module.exports = {
  insertIntoCompaniesTable,
  insertIntoFilesTable,
  insertIntoCallsTable,
  insertIntoParticipantsTable,
  insertIntoLastPollTable
  // editTagsTable
};
