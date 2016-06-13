const pg = require('pg')
const insertData = require('./insertData.js')

const checkFilesTable = (url, cli, obj, cb) => {
  cli.query('SELECT EXISTS (SELECT * FROM files WHERE file_name=($1))', [obj.file_name], (err1, res) => {
    if (err1) throw err1
    if (res.rows[0].exists === false) {
      insertData.addToFilesTable(url, cli, obj, cb)
    } else {
      cb(res)
    }
  })
}

module.exports = {
  checkFilesTable
}
