const pg = require('pg')
const tape = require('tape')
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest'
const getIds = require('../../polling/dbFunctions/getIds.js')

tape('test that the fmctest database and tables exists', (t) => {
  t.plan(4)
  const obj = {
    company_name: 'test_comp_A',
    file_name: 'recording_1',
    company_id: 100,
    file_id: 100
  }
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    getIds.getCompany_id(client, obj, (res) => {
      const actual = res
      const expected = '100'
      t.deepEqual(actual, expected, 'getCompany_id got the correct company_id from companies table')
      done()
    })
    getIds.getFile_id(client, obj, (res) => {
      const actual = res
      const expected = '100'
      t.deepEqual(actual, expected, 'getFile_id got the correct file_id from files table')
      done()
    })
    getIds.getCall_id(client, obj, (res) => {
      const actual = res
      const expected = '100'
      t.deepEqual(actual, expected, 'getCall_id got the correct call_id from calls table')
      done()
    })
    getIds.getUser_id(client, obj, (res) => {
      const actual = res
      const expected = '100'
      t.deepEqual(actual, expected, 'getUser_id got the correct user_id from users table')
      done()
    })
    pg.end()
  })
})
