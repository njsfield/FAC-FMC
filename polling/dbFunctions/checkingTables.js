const insertData = require('./insertData.js')

const checkCompaniesTable = ( cli, obj, cb) => {
  const queryArray = [obj.company_name]
  cli.query('SELECT EXISTS (SELECT * FROM companies WHERE company_name=($1))', queryArray, (err, res) => {
    if (err) throw err
    const boolKey = Object.keys(res.rows[0])[0]
    if (res.rows[0][boolKey] === false) {
      insertData.addToCompaniesTable( cli, obj, cb)
    } else {
      cb(res)
    }
  })
}

const checkFilesTable = ( cli, obj, cb) => {
  const queryArray = [obj.file_name]
  cli.query('SELECT EXISTS (SELECT * FROM files WHERE file_name=($1))', queryArray, (err, res) => {
    console.log('im checking the files table')
    if (err) throw err
    const boolKey = Object.keys(res.rows[0])[0]
    if (res.rows[0][boolKey] === false) {
      insertData.addToFilesTable( cli, obj, cb)
    } else {
      cb(res)

    }
  })
}

const getCompany_id = (cli, obj, cb) => {
  cli.query(`SELECT company_id FROM companies WHERE company_name=('${obj.company_name}')`, (err3, res3) => {
    if (err3) throw err3
    const boolKey3 = Object.keys(res3.rows[0])
    const company_id = res3.rows[0][boolKey3]
    cb(company_id)
  })
}

const getFile_id = (cli, obj, cb) => {
  cli.query(`SELECT file_id FROM files WHERE file_name=('${obj.file_name}')`, (err4, res4) => {
    if (err4) throw err4
    const boolKey4 = Object.keys(res4.rows[0])[0]
    const file_id = res4.rows[0][boolKey4]
    cb(file_id)
  })
}
const checkCallsTable = (cli, array, obj, cb) => {
  cli.query('SELECT EXISTS (SELECT * FROM calls WHERE company_id=($1) AND file_id=($2))', array, (err5, res5) => {
    if (err5) throw err5
    const boolKey5 = Object.keys(res5.rows[0])[0]
    if (res5.rows[0][boolKey5] === false) {
      //if not insert them into the calls table
      insertData.addToCallsTable( cli, obj, cb)
    } else {
      //else return the call
      cb(res5)
    }
  })
}

const pollerFlow = (cli, obj, cb) => {
  var companyID
  var fileID
  //checks if file_name exists in files table
  checkFilesTable( cli, obj, (response) => {
    getCompany_id(cli, obj, (response2) => {
      companyID = response2
      getFile_id(cli, obj, (response3) => {
        fileID = response3
        const queryArray = [companyID, fileID]
        checkCallsTable(cli, queryArray, obj, (response4) => {
          if (response4 === false) {
            // participants bit
            cb(response4)
          }
        }
      )
      })
    })
  })
}

const checkUsersTable = (url, cli, obj, cb) => {
  const queryArray = [obj.login]
  cli.query('SELECT EXISTS (SELECT * FROM users WHERE user_name=($1))', queryArray, (err, res) => {
    if (err) throw err
    const boolKey = Object.keys(res.rows[0])[0]
    if (res.rows[0][boolKey] === false) {
      checkCompaniesTable(url, cli, obj, () => {
        insertData.addToUsersTable(url, cli, obj, cb)
      })
    } else {
      cb(res)
    }
  })
}

module.exports = {
  checkFilesTable,
  checkCompaniesTable,
  checkCallsTable,
  checkUsersTable,
  pollerFlow
}
