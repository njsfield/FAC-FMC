/** Introduce functionality to store contact_id in users table */
'use strict';

require('env2')('config.env');
const JWT = require('jsonwebtoken');
const loginApi = require('../auth/checkCallerIdentification.js');
const pg = require('pg');
const errorHandler = require('../../errorHandler.js');
const postgresURL = process.env.POSTGRES_URL;
const {checkCompaniesTable} = require('../../polling/db/checkTables.js');
const {checkUsersTable} = require('../db/checkTables.js');
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
            console.log(err1);
            reply.redirect('/error/' + encodeURIComponent('error connecting to the database'));
          } else {
            const compObj = {
              company_name: user.user.company
            };
            checkCompaniesTable(dbClient, compObj, done, (err2, res) => {
              if (err2) {
                console.log(err2);
                return reply.redirect('/error/'+ encodeURIComponent('error connecting to the databse'));
              } else {
                const userObj = {
                  contact_id: user.user.id,
                  company_id: res
                };
                checkUsersTable(dbClient, userObj, done, (err3) => {
                  if (err3) {
                    console.log(err3);
                    return reply.redirect('/error/' + encodeURIComponent(err3) );
                  } else {
                    var authData = {
                      company_id: userObj.company_id,
                      contact_id: user.user.id,
                      username,
                      userRole
                    };
                    if (userRole==='admin') {
                      let queryString = 'select company_id, company_name as name from companies where';
                      let queryArray = [];
                      user.user.companies.forEach((company, i) => {
                        if (i < user.user.companies.length - 1) {
                          queryString += ' company_name = $' + (i+1);
                          queryString += ' OR';
                        } else {
                          queryString += ' company_name = $' + (i+1);
                        }
                        queryArray.push(company);
                      });
                      dbClient.query( queryString, queryArray, (err4, response) => {
                        if (err4) {
                          errorHandler(err4);
                        } else {
                          authData.adminCompanies = response.rows;
                          const token = JWT.sign(authData, process.env.JWT_KEY);
                          return reply.redirect('/dashboard').state('FMC', token, cookieOptions);
                        }
                      });
                    } else {
                      const token = JWT.sign(authData, process.env.JWT_KEY);
                      return reply.redirect('/dashboard').state('FMC', token, cookieOptions);
                    }

                  }
                });
              }
            });
          }
        });
      }
      else {
        return reply.view('login', {loginError: 'incorrect username or password'});
      }
    });
  }
};
