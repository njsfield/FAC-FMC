const insertData = require('./insertData.js')

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

const checkCallsTable = (url, cli, obj, cb) => {
  cli.query('SELECT company_id FROM companies WHERE company_name=($1)', [obj.company_name], (err, res) => {
    if (err) throw err
    const objKey = Object.keys(res.rows[0])[0]
    const companyID = res.rows[0][objKey]
    cli.query('SELECT file_id FROM files WHERE file_name=($1)', [obj.file_name], (err2, res2) => {
      if (err2) throw err2
      const objKey2 = Object.keys(res2.rows[0])[0]
      const fileID = res2.rows[0][objKey2]
      const queryArray = [companyID, fileID]
      cli.query('SELECT EXISTS (SELECT * FROM calls WHERE company_id=($1) AND file_id=($2))', queryArray, (err3, res3) => {
        if (err3) throw err3
        const boolKey = Object.keys(res.rows[0])[0]
        if (res.rows[0][boolKey] === false) {
          insertData.addToCallsTable(url, cli, obj, cb)
        } else {
          cb(res3)
        }
      })
    })
  })
}

module.exports = {
  checkFilesTable,
  checkCompaniesTable,
  checkCallsTable
}
