'use strict';
require('env2')('config.env');
const server = require('../../../src/server/server.js');
const nock = require('nock');
const tape = require('tape');
const JWT = require('jsonwebtoken');
const pbxUrl = process.env.PBX_URL;

/** Removes mocks completely when called */
function teardown () {
  nock.cleanAll();
};

/** Mocks a request to the IPC API, intercepts it and returns a simulated response. */
nock(pbxUrl)
          .persist()
          .post('/rest/auth')
          .reply(200, { token: 'a very long string of random characters',
               expires: 1467111677.992,
               result: 'success',
               user:
                { id: 240,
                  login: 'fac30b',
                  name: 'Virginie Trubiano B',
                  company: 'default',
                  home: 'default',
                  companies: [],
                  session: 'ipBPs4Cq3XHbwmRQ6k6aksj3',
                  perms: { user: 'yes', ocm: 'yes', persq_panel: 'yes' } } });

tape('test the login user flow for a successful api response from IPC for correct login details', (t) => {
  t.plan(6);
  server.inject({
    method: 'POST',
    url: '/login',
    payload: {
      username: 'testuser',
      password: 'testpassword'
    }
  }, (response) => {
    let actual = response.headers['set-cookie'][0].indexOf('token');
    let expected = 0;
    t.deepEqual(actual, expected, 'token is present in the response headers');

    const decoded = JWT.decode(response.headers['set-cookie'][0].split('=')[1]);
    actual = decoded.contact_id;
    expected = 240;
    t.deepEqual(actual, expected, 'expected contact_id is present in the token');

    actual = decoded.username;
    expected = 'testuser';
    t.deepEqual(actual, expected, 'expected username is present in the token');

    actual = decoded.userRole;
    expected = 'user';
    t.deepEqual(actual, expected, 'expected userRole is present in the token');

    actual = response.statusCode;
    expected = 302;
    t.deepEqual(actual, expected, 'redirects');

    actual = response.headers.location;
    expected = '/dashboard';
    t.deepEqual(actual, expected, 'redirects to dashboard view');
    teardown();
  });
});
