const insertData = require('./insertData.js')

// functions to get unique ids from tables
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

const getCall_id = (cli, obj, cb) => {
  const queryArray = [obj.company_id, obj.file_id]
  cli.query('SELECT call_id FROM calls WHERE company_id=($1) AND file_id=($2)', queryArray, (err4, res4) => {
    if (err4) throw err4
    const boolKey4 = Object.keys(res4.rows[0])[0]
    const call_id = res4.rows[0][boolKey4]
    cb(call_id)
  })
}

//functions to check a table for a specfic bit of data.
//If said data is not in the table functions are called to insert it
const checkCompaniesTable = (cli, obj, cb) => {
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
      insertData.addToFilesTable(cli, obj, cb)
    } else {
      cb(res)

    }
  })
}

const checkCallsTable = (cli, obj, cb) => {
  const queryArray = [obj.company_id, obj.file_id]
  cli.query('SELECT EXISTS (SELECT * FROM calls WHERE company_id=($1) AND file_id=($2))', queryArray, (err5, res5) => {
    if (err5) throw err5
    const boolKey5 = Object.keys(res5.rows[0])[0]
    if (res5.rows[0][boolKey5] === false) {
      //if not insert them into the calls table
      insertData.addToCallsTable(cli, obj, cb)
    } else {
      //else return the call
      cb(res5)
    }
  })
}

const checkUsersTable = (cli, done, obj, cb) => {
  const queryArray = [obj.login]
  cli.query('SELECT EXISTS (SELECT * FROM users WHERE user_name=($1))', queryArray, (err, res) => {
    if (err) throw err
    const boolKey = Object.keys(res.rows[0])[0]
    if (res.rows[0][boolKey] === false) {
      checkCompaniesTable(cli, obj, () => {
        insertData.addToUsersTable(cli, obj, cb)
      })
    } else {
      cb(res)
    }
  })
}

//This is the complete flow. Checks all tables required and adds
//data where necessary
const pollerFlow = (cli, done, obj, cb) => {
  //checks if file_name exists in files table
  checkFilesTable(cli, obj, () => {
    done()
    getCompany_id(cli, obj, (res2) => {
      done()
      obj.company_id = res2
      getFile_id(cli, obj, (res3) => {
        done()
        obj.file_id = res3
        checkCallsTable(cli, obj, (res4) => {
          // if doesnt exist add to partipants table
          if (res4.command === 'INSERT') {
            getCall_id(cli, obj, (res5) =>{
              obj.call_id = res5
              const callee = {
                call_id: obj.call_id,
                internal: false,
                participant_role: 'destination',
                number: obj.callee
              }
              const caller = {
                call_id: obj.call_id,
                internal: false,
                participant_role: 'source',
                number: obj.caller
              }
              insertData.addToParticipantsTable(cli, callee, (res6) => {
                console.log(res6, 'RES6<<<<<<<<<<<<<<<<<<<<<')
              })
              insertData.addToParticipantsTable(cli, caller, (res7) => {
                console.log(res7, 'RES7<<<<<<<<<<<<<<<<<<<<<')
              })
              done()

            })
          } else {
            cb(res4)
          }
        })
      })
    })
  })
}

const checkTagsTable = (url, cli, obj, cb) => {
  const queryArray = [obj.tag, obj.user_id]
  cli.query('SELECT EXISTS (SELECT * FROM tags WHERE tag=($1) AND company_id=((SELECT company_id FROM users WHERE user_id=($2))))', queryArray, (err, res) => {
    if (err) throw err
    const boolKey = Object.keys(res.rows[0])[0]
    if (res.rows[0][boolKey] === false) {
      insertData.addToTagsTable(url, cli, obj, cb)
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
  pollerFlow,
  checkTagsTable
}
