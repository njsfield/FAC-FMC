const dbFetchCalls = require('../db/dbFetchCalls.js');
const pg = require('pg');
module.exports = {
  method: 'GET',
  path: '/dashboard',
  config: {auth: false},
  handler: (request, reply) => {
    // console.log(user_id, '<----- user_id');
    // const user_id = request.params.user_id;
    // const company_id = request.params.company_id;
    // const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc';
    // pg.connect(postgresURL, (err, client, done) => {
    //   if (err) throw err;
    //   dbFetchCalls.fetchCalls(client, done, user_id, company_id, (result) => {
    //     const calls = {
    //       calls: result
    //     };
    reply('dashboard');
      // });
    // });
  }
};
