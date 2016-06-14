'use strict'
const tape = require('tape')
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmctest'
const fetchCalls = require('../../src/db/dbFetchCalls.js')
const pg = require('pg')

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
  const expected = fullResponse.toString()
  fetchCalls.restructureCallsResults(partipantsQueryResult, postgresURL, (results) => {
    const actual = results.toString()
    t.deepEqual(actual, expected, 'calls results restructured')
  })
})

tape('findOtherParticipant function locates the caller or callee for any given participant', (t) => {
  t.plan(1)
  const data = {
    call_id: '100',
    company_id: '100',
    participants: {
      source: {
        internal: true,
        number: '8',
        user: true
      }
    }
  }
  const expected = {
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
  }
  pg.connect(postgresURL, (err, client, done) => {
    if (err) throw err
    fetchCalls.findOtherParticipant(data, client, done, (result) => {
      const actual = result
      t.deepEqual(actual, expected, 'caller or callee located')
    })
  })
})

tape('find file_id, duration and time for the call', (t) => {
  const data = {
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
  }

  pg.connect(postgresURL, (err, client, done) => {
    t.plan(1)
    fetchCalls.findCallDetails(data, client, done, (results) => {
      const expected = '345678904356'
      const actual = results.duration
      t.deepEqual(expected, actual, 'congrats full response complete')
    })
  })
})

const partipantsQueryResult =
  [ { company_id: '100',
    participant_id: '100',
    call_id: '100',
    internal: true,
    participant_role: 'SOURCE',
    number: '8',
    user_id: '4387735' },
  { company_id: '100',
    participant_id: '104',
    call_id: '102',
    internal: true,
    participant_role: 'SOURCE',
    number: '8',
    user_id: '4387735' },
  { company_id: '100',
    participant_id: '108',
    call_id: '104',
    internal: true,
    participant_role: 'DESTINATION',
    number: '8',
    user_id: '4387735' } ]

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

const fullResponse = [
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
      },
      duration: '345678904356345',
      date: '2016-01-05 12:43:35',
      file_id: '1'
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
    },
    duration: '345678904356',
    time: '2016-01-06 12:43:35',
    file_id: '2'
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
    },
    duration: '2016-01-07 12:43:35',
    time: '345678904',
    file_id: '3',
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
