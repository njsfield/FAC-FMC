/** Introduce functionality to store contact_id in users table */
'use strict';

require('env2')('config.env');
const JWT = require('jsonwebtoken');
const loginApi = require('../../polling/api/checkCallerIdentification.js');
const pg = require('pg');
const postgresURL = process.env.POSTGRES_URL;
const {checkCompaniesTable} = require('../../polling/db/checkTables.js');
const {checkUsersTable} = require('../db/checkTables.js');

module.exports = {
  method: 'POST',
  path: '/login',
  config: { auth: false },
  handler: (request, reply) => {
    const password = request.payload.password;
    const username = request.payload.username;
    loginApi.checkLoginDetails(username, password, 'default', (user) => {

      if (user.result === 'success') {
        let userRole;
        if(user.user.perms.user === 'yes') {
          userRole = 'user';
        } else {
          userRole = 'admin';
        }

        pg.connect(postgresURL, (err, dbClient, done) => {
          if (err) throw err;
          const compObj = {
            company_name: user.user.company
          };
          checkCompaniesTable(dbClient, compObj, done, (res) => {
            const userObj = {
              contact_id: user.user.id,
              company_id: res
            };
            checkUsersTable(dbClient, userObj, done, () => {});
            const token = JWT.sign({
              company_id: userObj.company_id,
              contact_id: user.user.id,
              username,
              userRole
            }, process.env.JWT_KEY);
            return reply.redirect('/dashboard').state('token', token);
          });
        });
      }
      else {
        return reply.redirect('/');
      }
    });
  }
};
