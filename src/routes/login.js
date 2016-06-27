/** Introduce functionality to store contact_id in users table */
'use strict';

require('env2')('config.env');
const JWT = require('jsonwebtoken');
const loginApi = require('../../polling/api/check_caller_identification_api.js');
const pg = require('pg');
const postgresURL = 'postgres://postgres:postgrespassword@localhost/fmc';
const checkTable = require('../../polling/dbFunctions/checkTable.js');
const getID = require('../../polling/dbFunctions/getID.js');

module.exports = {
  method: 'POST',
  path: '/login',
  config: { auth: false },
  handler: (request, reply) => {
    const password = request.payload.password;
    const username = request.payload.username;
    loginApi.checkLoginDeets(username, password, 'default', (user) => {

      if (user.result === 'success') {
        let userRole;
        if(user.user.perms.user === 'yes') {
          userRole = 'user';
        } else {
          userRole = 'admin';
        }
        const token = JWT.sign({
          contact_id: user.user.id,
          username,
          password,
          userRole
        }, process.env.JWT_KEY);

        pg.connect(postgresURL, (err, dbClient) => {
          if (err) throw err;
          const compObj = {
            company_name: user.user.company
          };
          getID.getCompany_id(dbClient, compObj, (res) => {
            const userObj = {
              contact_id: user.user.id,
              company_id: res
            };
            checkTable.checkUsersTable(dbClient, userObj, (response) => {
              console.log(response, '<---response');
            });
          });
        });
        return reply.redirect('/dashboard').state('token', token);
      }
      else {
        return reply.redirect('/');
      }
    });
  }
};
