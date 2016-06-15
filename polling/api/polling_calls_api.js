// fetches array of file_names
'use strict'
const request = require('request')
//TODO config.env
const apiKey = process.env.API_KEY
const pbxUrl = 'https://fac1.ipcortex.net'

// searches for filenames by companyId
const updateFileNames = (companyId, callback) => {
  const options = {
    method: 'POST',
    url: pbxUrl + '/rest/call/list',
    headers:
    { 'cache-control': 'no-cache',
    'content-type': 'application/json' },
    body:
    { type: 'recording',
    scope: { company: companyId },
    auth: { type: 'auth', key: apiKey } },
    json: true }

  request(options, function (error, response, body) {
    if (error) throw new Error(error)
    const files = body.values.map((el) => {
      delete el.size
      el.company_id = companyId
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

module.exports = {
  updateFileNames,
  retrieveWav
}
