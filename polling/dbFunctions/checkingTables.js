const insertData = require('./insertData.js')

const checkFilesTable = (url, cli, obj, cb) => {
  const queryArray = [obj.file_name]
  cli.query('SELECT EXISTS (SELECT * FROM files WHERE file_name=($1))', queryArray, (err, res) => {
    if (err) throw err
    const boolKey = Object.keys(res.rows[0])[0]
    if (res.rows[0][boolKey] === false) {
      insertData.addToFilesTable(url, cli, obj, cb)
    } else {
      cb(res)
    }
  })
}

const checkCompaniesTable = (url, cli, obj, cb) => {
  const queryArray = [obj.company_name]
  cli.query('SELECT EXISTS (SELECT * FROM companies WHERE company_name=($1))', queryArray, (err, res) => {
    if (err) throw err
    const boolKey = Object.keys(res.rows[0])[0]
    if (res.rows[0][boolKey] === false) {
      insertData.addToCompaniesTable(url, cli, obj, cb)
    } else {
      cb(res)
    }
  })
}

const checkCallsTable = (url, cli, obj, cb) => {
  const queryArray = [obj.company_name, obj.file_name]
  cli.query('SELECT company_id FROM companies WHERE company_name=($1)', [obj.company_name], (err, res) => {
    if (err) throw err
    const objKey = Object.keys(res.rows[0])[0]
    const companyID = res.rows[0][objKey]
    cli.query('SELECT EXISTS (SELECT * FROM calls WHERE company_name=($1))', queryArray, (err1, res) => {
      if (err) throw err
      const boolKey = Object.keys(res.rows[0])[0]
      if (res.rows[0][boolKey] === false) {
        insertData.addToCCallsTable(url, cli, obj, cb)
      } else {
        cb(res)
      }
    })
  })
}



module.exports = {
  checkFilesTable,
  checkCompaniesTable,
  checkCallsTable
}
