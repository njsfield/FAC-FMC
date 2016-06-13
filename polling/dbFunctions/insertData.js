const addCompany = (url, client, object, callback) => {
  client.query('INSERT INTO companies VALUES ($1)', [object.company_name], (error, response) => {
    if (error) throw error
    callback(response)
  })
}

const addToFilesTable = (url, client, object, callback) => {
  client.query('INSERT INTO files (file_index, file_name) VALUES ($1, $2)', [object.file_index, object.file_name], (error2, response) => {
    if (error2) throw error2
    callback(response)
  })
}

module.exports = {
  addCompany,
  addToFilesTable
}
