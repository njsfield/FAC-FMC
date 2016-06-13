'use strict'
const tape = require('tape')
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest'
const fetchCalls = require('../../db/dbFetchCalls.js')

tape('test if one can check the participants table by user name and company', (t) => {
  t.plan(1)
  const user_id = '4387735'
  const company_id = '100'
  let actual
  const expected = 'object'
  fetchCalls.checkPartipicantsTable(postgresURL, user_id, company_id, (result) => {
    actual = typeof result
    t.equals( actual, expected, 'grabbed the participants rows for a user')
  })
})

tape('restructureCallsResults function prepares data for response', (t) => {
  t.plan(1)
  let data
  const user_id = '4387735'
  const company_id = '100'
  fetchCalls.checkPartipicantsTable(postgresURL, user_id, company_id, (result) => {
    data = result
    const expected = restructuredCallsResults
    const actual = fetchCalls.restructureCallsResults(data)
    t.deepEqual(actual, expected, 'calls results restructured')
  })
})

tape('findOtherParticipant function locates the caller or callee for any given participant', (t) => {
  t.plan(1)
  const expected = callsResultsWithAllParties
  fetchCalls.findOtherParticipant(postgresURL, restructuredCallsResults, (result) => {
    const actual = result
    t.deepEqual(actual, expected, 'caller or callee located')
  })
})

const restructuredCallsResults = [
  {
    call_id: '100',
    company_id: '100',
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
    company_id: '100',
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
    company_id: '100',
    participants: {
      destination: {
        internal: true,
        number: '8',
        user: true
      }
    }
  }
]

const callsResultsWithAllParties = [
  {
    call_id: '100',
    company_id: '100',
    participants: {
      source: {
        internal: true,
        number: '8',
        user: true
      },
      destination: {
        internal: false,
        number: '7',
        user: false
      }
    }
  },
  {
    call_id: '102',
    company_id: '100',
    participants: {
      source: {
        internal: true,
        number: '8',
        user: true
      },
      destination: {
        internal: true,
        number: '9',
        user: false
      }
    }
  },
  {
    call_id: '104',
    company_id: '100',
    participants: {
      destination: {
        internal: true,
        number: '8',
        user: true
      },
      source: {
        internal: false,
        number: '7',
        user: false
      }
    }
  }
]
// const resultArr = [
//   {
//     company_id: '2',
//     call_id: '100',
//     participants: {
//       source: {
//         internal: true,
//         number: '4387735'
//       },
//       destination: {
//         internal: false,
//         number: '3222'
//       }
//     },
//     time: '2016-01-05 12:43:35',
//     duration: '345678904356345',
//     file_id: '100'
//   }
// ]
