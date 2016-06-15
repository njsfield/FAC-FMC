const pg = require('pg')
const tape = require('tape')
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest'
const pollingFuncs = require('../../polling/dbFunctions/checkingTables.js')

tape('tests if company exists in companies table', (t) => {
  const arrayOfObj = [{
    company_name: 'test_comp_A',
  }, {
    company_name: 'test_comp_B',
  }]

  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    arrayOfObj.map(e => {
      pollingFuncs.checkCompaniesTable(postgresURL, client, e, (res) => {
        const expected = true
        const boolKey = Object.keys(res.rows[0])[0]
        const actual = res.rows[0][boolKey]
        t.deepEqual(actual, expected, 'company_name test_comp_A and test_comp_B are in companies table')
        done()
      })
    })
    t.end()
    pg.end()
  })
})

tape('tests that file does NOT exist in files table and then adds it', (t) => {
  const arrayOfObj = [{
    file_index: 44,
    file_name: 'recording_44'
  }, {
    file_index: 45,
    file_name: 'recording_45'
  }]

  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    arrayOfObj.map(e => {
      pollingFuncs.checkFilesTable(postgresURL, client, e, (res) => {
        const expected = 'INSERT'
        const actual = res.command
        t.deepEqual(actual, expected, 'file_name recording_44 has been added to files table')
        done()
      })
    })
    t.end()
    pg.end()
  })
})

tape('tests if company exists in companies table', (t) => {
  const arrayOfObj = [{
    company_name: 'test_comp_A',
  }, {
    company_name: 'test_comp_B',
  }]

  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    arrayOfObj.map(e => {
      pollingFuncs.checkCompaniesTable(postgresURL, client, e, (res) => {
        const expected = true
        const boolKey = Object.keys(res.rows[0])[0]
        const actual = res.rows[0][boolKey]
        t.deepEqual(actual, expected, 'company_name test_comp_A and test_comp_B are in companies table')
        done()
      })
    })
    t.end()
    pg.end()
  })
})

tape('tests that company does NOT exist in companies table and then adds it', (t) => {
  const arrayOfObj = [{
    company_name: 'comp_A',
  }, {
    company_name: 'comp_B',
  }]

  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    arrayOfObj.map(e => {
      pollingFuncs.checkCompaniesTable(postgresURL, client, e, (res) => {
        const expected = 'INSERT'
        const actual = res.command
        t.deepEqual(actual, expected, 'company_name comp_A and comp_B have been added to companies table')
        done()
      })
    })
    t.end()
    pg.end()
  })
})

tape('test if call exists in calls table', (t) => {
  const obj = {
    company_name: 'test_comp_A',
    file_name: 'recording_1'
  }
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    pollingFuncs.checkCallsTable(postgresURL, client, obj, (res) => {
      const boolKey = Object.keys(res.rows[0])[0]
      const actual = res.rows[0][boolKey]
      const expected = true
      t.deepEqual(actual, expected, 'this call is in the files table')
      done()
    })
    t.end()
    pg.end()
  })
})

// tape('test if call does not exist in calls table and inserts it', (t) => {
//   const obj = {
//     company_name: 'test_comp_c',
//     file_name: 'recording_1'
//   }
//   pg.connect(postgresURL, (err, client, done) => {
//     if (err) throw err
//     pollingFuncs.checkCallsTable(postgresURL, client, obj, (res) => {
//       const actual = res.command
//       const expected = 'INSERT'
//       t.deepEqual(actual, expected, 'this call is in the files table')
//       done()
//     })
//     t.end()
//     pg.end()
//   })
// })
