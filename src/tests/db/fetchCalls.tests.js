'use strict'
const tape = require('tape')
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest'
const fetchCalls = require('../../db/dbFetchCalls.js')

tape('test if one can check the participants table by user name and company', (t) => {
  const user_id = '4387735'
  const company_id = '100'
  let actual
  fetchCalls.checkPartipicantsTable(postgresURL, user_id, company_id, (result) => {
    actual = typeof result
  })
  const expected = 'object'
  t.plan(1)
  setTimeout(() => {
    t.equals( actual, expected, 'grabbed the participants rows for a user')
  }, 500)
})

tape('check for duplicate call_ids, if not, add to list', (t) => {
  // simulate data model
  const resultArr = [
    {
      company_id: '2',
      call_id: '100',
      participants: {
        source: {
          internal: true,
          number: '4387735'
        },
        destination: {
          internal: true,
          number: '4387635'
        }
      },
      time: '4387735',
      duration: '100',
      file_id: 100
    }
  ]

})
