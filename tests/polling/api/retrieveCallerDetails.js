const {test} = require('../../wrapping-tape-setup.js');
const retrieveCallerDetails = require('../../../polling/api/retrieveCallerDetails.js');
const virtualExt = {
  short: ['241'],
  long: ['241', '239']
};
test('test polling calls api functions ', (t) => {
  t.plan(3);

  retrieveCallerDetails(virtualExt.short, (err, res) => {
    if (err) console.log(err);
    const actual = res.values[0].virt_exten;
    const expected = '241';
    t.deepEqual(actual, expected, 'virtual extension number is as expected in values array');
  });
  retrieveCallerDetails(virtualExt.long, (err, res) => {
    if (err) console.log(err);
    const actual = res.values[0].virt_exten;
    const expected = '241';
    t.deepEqual(actual, expected, 'virtual extension numbers are as expected in values array');
  });
  retrieveCallerDetails(['wrong'], (err, res) => {
    if (err) console.log(err);
    const actual = res.numrows;
    const expected = 0;
    t.deepEqual(actual, expected, 'incorrect extension number isn\'t added to table');
  });
});
