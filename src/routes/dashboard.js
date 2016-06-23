const dbFetchCalls = require('../db/dbFetchCalls.js');
const pg = require('pg');
module.exports = {
  method: 'GET',
  path: '/dashboard/{contact_id}/{company_id}',
  handler: (request, reply) => {
    const contact_id = request.params.contact_id;
    const company_id = request.params.company_id;
    const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc';
    pg.connect(postgresURL, (err, client, done) => {
      if (err) throw err;
      dbFetchCalls.fetchCalls(client, done, contact_id, company_id, (result) => {
        const calls = {
          calls: result
        };
        reply.view('dashboard', calls);
      });
    });
  }
};
