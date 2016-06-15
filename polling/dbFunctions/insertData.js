const addToCompaniesTable = (url, client, object, callback) => {
  const queryArray = [object.company_name]
  client.query('INSERT INTO companies (company_name) VALUES ($1)', queryArray, (error, response) => {
    if (error) throw error
    callback(response)
  })
}

const addToFilesTable = (url, client, object, callback) => {
  const queryArray = [object.file_index, object.file_name]
  client.query('INSERT INTO files (file_index, file_name) VALUES ($1, $2)', queryArray, (error, response) => {
    if (error) throw error
    callback(response)
  })
}

const addToCallsTable = (url, client, object, callback) => {
  client.query(`SELECT TIMESTAMP WITH TIME ZONE 'epoch' + ${object.date} * INTERVAL '1' second`, (err, res) => {
    const objKey = Object.keys(res.rows[0])
    const timestamp = res.rows[0][objKey]
    const queryArray = [timestamp, object.company_name, object.file_name, object.duration]
    client.query('INSERT INTO calls (date, company_id, file_id, duration) VALUES ($1, (SELECT company_id FROM companies WHERE company_name=$2), (SELECT file_id FROM files WHERE file_name=$3), $4)', queryArray, (error, response) => {
      if (error) throw error
      callback(response)
    })
  })
}

const addToUsersTable = (url, client, object, callback) => {
  const queryArray = [object.user_name, object.company_name, object.user_role]
  client.query('INSERT INTO users (user_name, company_id, user_role) VALUES ($1, (SELECT company_id FROM companies WHERE company_name=$2), $3)', queryArray, (error, response) => {
    if (error) throw error
    callback(response)
  })
}

module.exports = {
  addToCompaniesTable,
  addToFilesTable,
  addToCallsTable,
  addToUsersTable
}
