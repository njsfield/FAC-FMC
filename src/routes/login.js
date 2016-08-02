/** Introduce functionality to store contact_id in users table */
'use strict';

require('env2')('config.env');
const JWT = require('jsonwebtoken');
const loginApi = require('../auth/checkCallerIdentification.js');
const pg = require('pg');
const postgresURL = process.env.POSTGRES_URL;
const {checkUsersTable, checkCompaniesTable} = require('../db/checkTables.js');
const cookieOptions = require('../auth/cookieOptions.js');

module.exports = {
  method: 'POST',
  path: '/login',
  config: { auth: false },
  handler: (request, reply) => {
    const password = request.payload.password;
    const username = request.payload.username;
    loginApi.checkLoginDetails(username, password, (err, user) => {
      if (user.result === 'success') {
        let userRole = (user.user.perms.callrec_co != null && user.user.companies.length>0) ? 'admin': 'user';
        pg.connect(postgresURL, (err1, dbClient, done) => {
          if (err1) {
            done();
            console.log(err1);
            reply.redirect('/error/' + encodeURIComponent('error connecting to the database'));
          } else {
            const compObj = {
              company_name: user.user.company
            };
            checkCompaniesTable(dbClient, compObj, (err2, res) => {
              if (err2) {
                console.log(err2);
                done();
                return reply.redirect('/error/'+ encodeURIComponent('error connecting to the databse'));
              } else {
                const userObj = {
                  contact_id: user.user.id,
                  company_id: res
                };
                checkUsersTable(dbClient, userObj, (err3) => {
                  if (err3) {
                    console.log(err3);
                    done();
                    return reply.redirect('/error/' + encodeURIComponent(err3.error) );
                  } else {
                    var authData = {
                        company_id: userObj.company_id,
                        contact_id: user.user.id,
                        username,
                        userRole
                    };
                    if (userRole==='admin')
                      authData.adminCompanies = user.user.companies.map( name => ({name:name}));

                    const token = JWT.sign(authData, process.env.JWT_KEY);
                    done();
                    return reply.redirect('/dashboard').state('FMC', token, cookieOptions);
                  }
                });
              }
            });
          }
        });
      }
      else {
        return reply.redirect('/');
      }
    });
  }
};
