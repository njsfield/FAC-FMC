const {test} = require('../../wrapping-tape-setup.js');
const retrieveCompanyCalls = require('../../../polling/api/retrieveCompanyCalls.js');
const calculatePollTimes = require('../../../polling/api/calculatePollTimes.js');
const timeObj = calculatePollTimes(new Date(), new Date() - 36000000);
test('test the PABX to see if we can retrieveCompanyCalls', (t) => {
  t.plan(2);
  // these tests will expire
  retrieveCompanyCalls('default', timeObj[0], (err, file_objs) => {
    if (err) console.log(err);
    const actual = typeof file_objs;
    const expected = 'object';
    t.deepEqual(actual, expected, 'company name is as expected in returned object for correct parameter');
  });
  retrieveCompanyCalls('wrong', timeObj[0], (err, response) => {
    if (err) console.log(err);
    const actual = response.result;
    const expected = 'fail';
    t.deepEqual(actual, expected, 'incorrect company name returns expected callback response');
  });
});
