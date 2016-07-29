const {test} = require('../../wrapping-tape-setup.js');
const retrieveWav = require('../../../polling/api/retrieveWavFiles.js');

test('test polling calls api functions ', (t) => {
  t.plan(2);
  retrieveWav('2016.06.15.14.36.01-1465997761-239-238.wav', (err, res) => {
    const actual = res.result;
    const expected = 'fail';
    t.deepEqual(actual, expected, 'passed out of date file name, returns nothing');
  });
  retrieveWav('2016.06.15.14.36.01-1239-238.wav', (err, res) => {
    const actual = res.result;
    const expected = 'fail';
    t.deepEqual(actual, expected, 'passed wrong file name, doesn\'t return file');
  });
});
