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
    if (err) throw err
    const boolKey = Object.keys(res.rows[0])[0]
    if (res.rows[0][boolKey] === false) {
      insertData.addToFilesTable( cli, obj, cb)
    } else {
      cb(res)
    }
  })
}

const checkCallsTable = (cli, obj, cb) => {
  var companyID
  var fileID
  //checks if company_name exists in companies table
  cli.query('SELECT EXISTS (SELECT company_id FROM companies WHERE company_name=($1))', [obj.company_name], (err, res) => {
    if (err) throw err
    const boolKey = Object.keys(res.rows[0])[0]
    if (res.rows[0][boolKey] === true) {
        //checks if file_name exists in files table
      cli.query('SELECT EXISTS (SELECT file_id FROM files WHERE file_name=($1))', [obj.file_name], (err2, res2) => {
        if (err2) throw err2
        const boolKey2 = Object.keys(res2.rows[0])[0]
        if (res2.rows[0][boolKey2] === true) {
            //checks to see if the combination of company_id and file_id exist in the calls table
          cli.query(`SELECT company_id FROM companies WHERE company_name=('${obj.company_name}')`, (err3, res3) => {
            if (err3) throw err3
            const boolKey3 = Object.keys(res3.rows[0])
            companyID = res3.rows[0][boolKey3]
            cli.query(`SELECT file_id FROM files WHERE file_name=('${obj.file_name}')`, (err4, res4) => {
              if (err4) throw err4
              const boolKey4 = Object.keys(res4.rows[0])[0]
              fileID = res4.rows[0][boolKey4]
              const queryArray = [companyID, fileID]
              cli.query('SELECT EXISTS (SELECT * FROM calls WHERE company_id=($1) AND file_id=($2))', queryArray, (err5, res5) => {
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
            })
          })
            //if company exists but file does not add file and call
        } else {
          insertData.addToFilesTable( cli, obj, () => {
            insertData.addToCallsTable( cli, obj, cb)
          })
        }
      })
          //returns res of if company_name exists but file_name does not
          // if company_name does not exist in companies table
    } else {
      insertData.addToCompaniesTable( cli, obj, () => {
        cli.query('SELECT EXISTS (SELECT file_id FROM files WHERE file_name=($1))', [obj.file_name], (err3, res3) => {
          if (err3) throw err3
          const boolKey2 = Object.keys(res3.rows[0])[0]
          if (res3.rows[0][boolKey2] === true) {
            insertData.addToCallsTable( cli, obj, cb)
          }
          else {
            insertData.addToFilesTable( cli, obj, () => {
              insertData.addToCallsTable( cli, obj, cb)
            })
          }
        })
      })
    }
  })
    //returns res of if company_name does not exist
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
  checkUsersTable
}
