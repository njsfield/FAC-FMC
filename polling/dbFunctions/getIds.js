// functions to get unique ids from tables

const getCompany_id = (cli, obj, cb) => {
  cli.query(`SELECT company_id FROM companies WHERE company_name=('${obj.company_name}')`, (err, res) => {
    if (err) throw err
    const boolKey3 = Object.keys(res.rows[0])
    const company_id = res.rows[0][boolKey3]
    cb(company_id)
  })
}

const getFile_id = (cli, obj, cb) => {
  cli.query(`SELECT file_id FROM files WHERE file_name=('${obj.file_name}')`, (err, res) => {
    if (err) throw err
    const boolKey4 = Object.keys(res.rows[0])[0]
    const file_id = res.rows[0][boolKey4]
    cb(file_id)
  })
}

const getCall_id = (cli, obj, cb) => {
  const queryArray = [obj.company_id, obj.file_id]
  cli.query('SELECT call_id FROM calls WHERE company_id=($1) AND file_id=($2)', queryArray, (err, res) => {
    if (err) throw err
    const boolKey4 = Object.keys(res.rows[0])[0]
    const call_id = res.rows[0][boolKey4]
    cb(call_id)
  })
}

const getUser_id = (cli, obj, cb) => {
  cli.query(`SELECT user_id FROM users WHERE company_id=('${obj.company_id}')`, (err, res) => {
    if (err) throw err
    const boolKey3 = Object.keys(res.rows[0])
    const company_id = res.rows[0][boolKey3]
    cb(company_id)
  })
}

module.exports = {
  getCompany_id,
  getFile_id,
  getCall_id,
  getUser_id
}
