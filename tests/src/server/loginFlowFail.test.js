'use strict';
require('env2')('config.env');
const pg = require('pg');
const server = require('../../../src/server/server.js');
const nock = require('nock');
const tape = require('tape');
const pbxUrl = process.env.PBX_URL;

/** Removes mocks completely when called */
function teardown () {
  nock.cleanAll();
};

nock(pbxUrl)
          .persist()
          .post('/rest/auth')
          .reply(200, { result: 'fail', message: 'Login incorrect.' });

tape('test the login user flow for a successful api response from IPC for incorrect login details', (t) => {
  t.plan(3);
  server.inject({
    method: 'POST',
    url: '/login',
    payload: {
      username: 'testimposter',
      password: 'testimposterpassword'
    }
  }, (response) => {

    let actual = JSON.stringify(response.headers).indexOf('token');
    let expected = -1;
    t.deepEqual(actual, expected, 'token is not present in the response headers');

    actual = response.statusCode;
    expected = 302;
    t.deepEqual(actual, expected, 'redirects');

    actual = response.headers.location;
    expected = '/';
    t.deepEqual(actual, expected, 'redirects to login view');
    teardown();
    pg.end();
  });
});
