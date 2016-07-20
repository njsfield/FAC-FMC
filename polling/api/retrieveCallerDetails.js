require('env2')('config.env');
const request = require('request');
const apiKey = process.env.API_KEY;
/**
* Fetches caller details for a particular company_name.
* @param {string} company_name
* @param {array} extension_list - array of strings
* @param {function} callback - returns body object:
*  { result: 'success', values: [], numrows: 0 }
*
*  where the 'values' array contains objects:
*  { virt_exten: '238',
company: 'default',
scoped_exten: '238',
owner: 255 }
*/
module.exports = (company_name, extension_list, callback) => {
  const options = {
    method: 'post',
    url: process.env.PBX_URL + '/rest/dialplan/read',
    encoding: null,
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json'
    },
    body: {
      type: 'extension',
      scope: {     // eg "400"
        'virt_exten': extension_list,    // eg "400_company",
        'company': company_name,
      },
      auth: {
        type: 'auth',
        key: apiKey
      },
      columns: [
        'virt_exten',
        'company',
        'scoped_exten',
        'owner'
      ]
    },
    json: true
  };
  request(options, function (error, response, body) {
    if (error) throw error;
    callback(body);
  });
};
