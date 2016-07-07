const tape = require('tape');
const pg = require('pg');
const pollCalls = require('../../../polling/api/pollingCalls.js');
const virtualExt = {
  short: ['241'],
  long: ['241', '239']
};

tape('test polling calls api functions ', (t) => {
  t.plan(8);
  pollCalls.retrieveCompanyCalls('default', (file_objs) => {
    const actual = file_objs[0].company_name;
    const expected = 'default';
    t.deepEqual(actual, expected, 'company name is as expected in returned object for correct parameter');
  });
  pollCalls.retrieveCompanyCalls('wrong', (response) => {
    const actual = response;
    const expected = 'Company name does not exist.';
    t.deepEqual(actual, expected, 'incorrect company name returns expected callback response');
  });
  pollCalls.retrieveCallerDetails('default', virtualExt.short, (res) => {
    const actual = res.values[0].virt_exten;
    const expected = '241';
    t.deepEqual(actual, expected, 'virtual extension number is as expected in values array');
  });
  pollCalls.retrieveCallerDetails('default', virtualExt.long, (res) => {
    const actual = res.values[0].virt_exten;
    const expected = '241';
    t.deepEqual(actual, expected, 'virtual extension numbers are as expected in values array');
  });
  pollCalls.retrieveCallerDetails('default', ['wrong'], (res) => {
    const actual = res.numrows;
    const expected = 0;
    t.deepEqual(actual, expected, 'incorrect extension number isn\'t added to table');
  });
  pollCalls.retrieveCallerDetails('wrong', virtualExt.short, (res) => {
    const actual = res.values.length;
    const expected = 0;
    t.deepEqual(actual, expected, 'incorrect company name won\'t add values to the array');
  });
  pollCalls.retrieveWav('2016.06.15.14.36.01-1465997761-239-238.wav', (res) => {
    const actual = !(res.result === 'fail');
    const expected = true;
    t.deepEqual(actual, expected, 'passed right file name, returns wav file');
  });
  pollCalls.retrieveWav('2016.06.15.14.36.01-1239-238.wav', (res) => {
    const actual = !(res.result === 'fail');
    const expected = false;
    t.deepEqual(actual, expected, 'passed wrong file name, doesn\'t return file');
  });
});
