const pg = require('pg')
const tape = require('tape')
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest'
const getIds = require('../../polling/dbFunctions/getIds.js')

tape('test getCompany_id', t => {
  const obj = {
    company_name: 'test_comp_A'
  }
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    getIds.getCompany_id(client, obj, (res) => {
      const actual = res
      const expected = '100'
      t.deepEqual(actual, expected, 'getCompany_id got the correct company_id from companies table')
      done()
    })
    t.end()
    pg.end()
  })
})

tape('test getFile_id', t => {
  const obj = {
    file_name: 'recording_1'
  }
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    getIds.getFile_id(client, obj, (res) => {
      const actual = res
      const expected = '100'
      t.deepEqual(actual, expected, 'getFile_id got the correct file_id from files table')
      done()
    })
    t.end()
    pg.end()
  })
})

tape('test getCall_id', t => {
  const obj = {
    company_id: 100,
    file_id: 100
  }
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    getIds.getCall_id(client, obj, (res) => {
      const actual = res
      const expected = '100'
      t.deepEqual(actual, expected, 'getCall_id got the correct call_id from calls table')
      done()
    })
    t.end()
    pg.end()
  })
})

tape('test getUser_id', t => {
  const obj = {
    company_id: 100
  }
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    getIds.getUser_id(client, obj, (res) => {
      const actual = res
      const expected = '100'
      t.deepEqual(actual, expected, 'getUser_id got the correct user_id from users table')
      done()
    })
    t.end()
    pg.end()
  })
})
