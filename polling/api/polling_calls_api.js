// fetches array of file_names
'use strict'
const request = require('request')
//TODO config.env
const apiKey = 'tywfu4765fw74ie6b5fow4387f5bw7346bf5'
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

