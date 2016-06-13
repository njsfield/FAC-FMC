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

tape('restructureCallsResults', (t) => {
  t.plan(1)
  let data
  const user_id = '4387735'
  const company_id = '100'
  fetchCalls.checkPartipicantsTable(postgresURL, user_id, company_id, (result) => {
    data = result
  })
  setTimeout(() => {
    const expected = restructuredCallsResults
    const actual = fetchCalls.restructureCallsResults(data)
    t.deepEqual(actual, expected, 'calls results restructured')
  }, 500 )
})

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
        internal: false,
        number: '3222'
      }
    },
    time: '2016-01-05 12:43:35',
    duration: '345678904356345',
    file_id: '100'
  }
]

const restructuredCallsResults = [
  {
    call_id: '100',
    participants: {
      source: {
        internal: true,
        number: '8',
        user: true
      }
    }
  },
  {
    call_id: '102',
    participants: {
      source: {
        internal: true,
        number: '8',
        user: true
      }
    }
  },
  {
    call_id: '104',
    participants: {
      destination: {
        internal: true,
        number: '8',
        user: true
      }
    }
  }
]
