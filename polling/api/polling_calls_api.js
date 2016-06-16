// fetches array of file_names
'use strict'
const request = require('request')
//TODO config.env
const apiKey = 'tywfu4765fw74ie6b5fow4387f5bw7346bf5'
const pbxUrl = 'https://fac1.ipcortex.net'

// searches for filenames by companyId
const updateFileNames = (company_name, callback) => {
  const options = {
    method: 'POST',
    url: pbxUrl + '/rest/call/list',
    headers:
    { 'cache-control': 'no-cache',
    'content-type': 'application/json' },
    body:
    { type: 'recording',
    scope: { company: company_name },
    auth: { type: 'auth', key: apiKey } },
    json: true }

  request(options, function (error, response, body) {
    if (error) throw new Error(error)
    const files = body.values.map((el) => {
      delete el.size
      el.company_name = company_name
      el.date = el.start
      delete el.start
      el.file_name = el.file
      delete el.file
      return el
    })
    callback(files)
  })
}

// once we have file_names, fetches the ACTUAL wav file.
const retrieveWav = (fileName, callback) => {
  const options = { method: 'POST',
  url: pbxUrl + '/rest/call/download/recording',
  encoding: null,
  headers:
  { 'cache-control': 'no-cache',
  'content-type': 'application/json' },
  body:
  { type: 'recording',
  scope:
  { company: 'default',
  file: fileName },
  auth: { type: 'auth', key: apiKey } },
  json: true }

  request(options, function (error, response, body) {
    if (error) throw new Error(error)

    callback(body)
  })
}

const retrieveCallerDetails = (company_name, extensionNumber, callback) => {
  const options = {
    url: pbxUrl + '/rest/dialplan/read',
    encoding: null,
    headers:
    { 'cache-control': 'no-cache',
    'content-type': 'application/json' },
    body: {
      'type': 'extension',
      'scope': {
        'scoped_exten': extensionNumber
      },
      'columns': [
        'virt_exten',
        'company',
        'scoped_exten',
        'owner'
      ]
    }
  }
  request(options, function (error, response, body) {
    if (error) throw new Error(error)
    callback(body)
  })

}

module.exports = {
  updateFileNames,
  retrieveWav,
  retrieveCallerDetails
}
