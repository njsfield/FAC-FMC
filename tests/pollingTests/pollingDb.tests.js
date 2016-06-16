const pg = require('pg')
const tape = require('tape')
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest'
const pollingFuncs = require('../../polling/dbFunctions/checkingTables.js')
const insertFuncs = require('../../polling/dbFunctions/insertData.js')

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

tape('tests that company does NOT exist in companies table and then inserts it', (t) => {
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

tape('tests if file exists in files table', (t) => {
  const arrayOfObj = [{
    file_index: 1,
    file_name: 'recording_1'
  }, {
    file_index: 2,
    file_name: 'recording_2'
  }]

  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    arrayOfObj.map(e => {
      pollingFuncs.checkFilesTable(postgresURL, client, e, (res) => {
        const expected = true
        const boolKey = Object.keys(res.rows[0])[0]
        const actual = res.rows[0][boolKey]
        t.deepEqual(actual, expected, 'file_name recording_1 is in files table')
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
      t.deepEqual(actual, expected, 'this call is in the calls table')
      done()
    })
    t.end()
    pg.end()
  })
})

tape('test if new company_name exists in companies table, inserts if not and then inserts to calls table', (t) => {
  const obj = {
    file_index: 10,
    date: 1465984211,
    company_name: 'test_comp_new',
    file_name: 'recording_1',
    duration: 123
  }
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    pollingFuncs.checkCallsTable(postgresURL, client, obj, (res) => {
      const actual = res.command
      const expected = 'INSERT'
      t.deepEqual(actual, expected, 'company and call inserted into relevant tables')
      done()
    })
    t.end()
    pg.end()
  })
})

tape('test if new file_name exists in files table, inserts if not and then inserts to calls table', (t) => {
  const obj = {
    file_index: 10,
    date: 1465984211,
    company_name: 'test_comp_A',
    file_name: 'recording_new',
    duration: 123
  }
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    pollingFuncs.checkCallsTable(postgresURL, client, obj, (res) => {
      const actual = res.command
      const expected = 'INSERT'
      t.deepEqual(actual, expected, 'file and call inserted into relevant tables')
      done()
    })
    t.end()
    pg.end()
  })
})

tape('test if new company_name and file_name exist in relevant tables, inserts them if not and then inserts into calls table', (t) => {
  const obj = {
    file_index: 10,
    date: 1465984211,
    company_name: 'test_comp_fake',
    file_name: 'recording_fake',
    duration: 123
  }
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    pollingFuncs.checkCallsTable(postgresURL, client, obj, (res) => {
      const actual = res.command
      const expected = 'INSERT'
      t.deepEqual(actual, expected, 'company, file and call inserted into relevant tables')
      done()
    })
    t.end()
    pg.end()
  })
})

tape('test if user exists in users table and if not, inserts it', (t) => {
  const obj = {
    user_name: 'guillaume',
    company_name: 'test_comp_supertest',
    user_role: 'yes'
  }
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    pollingFuncs.checkUsersTable(postgresURL, client, obj, (res) => {
      const actual = res.command
      const expected = 'INSERT'
      t.deepEqual(actual, expected, 'user inserted into users table')
      done()
    })
    t.end()
    pg.end()
  })
})

tape('test if user exists in users table and if not, inserts it', (t) => {
  const obj = {
    user_name: 'guillaume',
    company_name: 'test_comp_A',
    user_role: 'yes'
  }
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    pollingFuncs.checkUsersTable(postgresURL, client, obj, (res) => {
      const actual = res.command
      const expected = 'INSERT'
      t.deepEqual(actual, expected, 'user inserted into users table')
      done()
    })
    t.end()
    pg.end()
  })
})

tape('test if participant get inserted in participants table', (t) => {
  const obj = {
    call_id: '100',
    number: '4657897980',
    internal: true,
    participant_role: 'admin',
    user_id: 100
  }
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    insertFuncs.addToParticipantsTable(postgresURL, client, obj, (res) => {
      const actual = res.command
      const expected = 'INSERT'
      t.deepEqual(actual, expected, 'participant inserted into participants table')
      done()
    })
    t.end()
    pg.end()
  })
})
