const dbFetchCalls = require('../db/dbFetchCalls.js');
const pg = require('pg');
module.exports = {
  method: 'GET',
  path: '/dashboard',
  config: {auth: false},
  handler: (request, reply) => {
    const contact_id = request.params;
    console.log(contact_id, '<----- contact_id');
    const company_id = request.params.company_id;
    const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc';
    pg.connect(postgresURL, (err, client, done) => {
      if (err) throw err;
      dbFetchCalls.fetchCalls(client, done, 4387735, 101, (result) => {
        const calls = {
          calls: result
        };
        reply.view('dashboard', calls);
      });
    });
  }
};
// 4387735/101
