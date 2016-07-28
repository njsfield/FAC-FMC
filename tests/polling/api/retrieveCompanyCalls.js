const {test} = require('../../wrapping-tape-setup.js');
const retrieveCompanyCalls = require('../../../polling/api/retrieveCompanyCalls.js');
const calculatePollTimes = require('../../../polling/api/calculatePollTimes.js');
const timeObj = calculatePollTimes(new Date(), new Date() - 36000000);
console.log(timeObj);
test('test the PABX to see if we can retrieveCompanyCalls', (t) => {
  t.plan(2);
  retrieveCompanyCalls('default', timeObj[0], (file_objs) => {
    const actual = file_objs[0].company_name;
    const expected = 'default';
    t.deepEqual(actual, expected, 'company name is as expected in returned object for correct parameter');
  });
  retrieveCompanyCalls('wrong', timeObj[0], (response) => {
    const actual = response.result;
    const expected = 'fail';
    t.deepEqual(actual, expected, 'incorrect company name returns expected callback response');
  });
});
