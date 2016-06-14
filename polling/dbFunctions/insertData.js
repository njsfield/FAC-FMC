const addToCompaniesTable = (url, client, object, callback) => {
  client.query('INSERT INTO companies (company_name) VALUES ($1)', [object.company_name], (error, response) => {
    if (error) throw error
    callback(response)
  })
}

const addToFilesTable = (url, client, object, callback) => {
  client.query('INSERT INTO files (file_index, file_name) VALUES ($1, $2)', [object.file_index, object.file_name], (error, response) => {
const addToCallsTable = (url, client, object, callback) => {
  const queryArray = [object.date, object.company_name, object.file_name, object.duration]
  client.query('INSERT INTO calls (date, company_id, file_id, duration) VALUES ($1, (SELECT company_id FROM companies WHERE company_name=$2), (SELECT file_id FROM files WHERE file_name=$3), $4)', queryArray, (error, response) => {
    if (error) throw error
    callback(response)
  })
}

module.exports = {
  addToCompaniesTable,
  addToFilesTable,
  addToCallsTable
}
