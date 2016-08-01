const {test} = require('../../wrapping-tape-setup.js');
const calculatePollTimes = require('../../../polling/api/calculatePollTimes.js');

test (' returns an array of times', (t) => {
  t.plan(4);
  const startPoll = new Date(2016, 6, 20, 1, 0);
  const lastPoll = new Date(startPoll - 3600000 * 3);
  const actual = calculatePollTimes(startPoll, lastPoll).length;
  const expected = 5;
  t.deepEquals(actual, expected, 'the calculatePollTimes works');

  const lastPoll1 = new Date(startPoll - 3600000 * 28);
  const actual1 = calculatePollTimes(startPoll, lastPoll1).length;
  const expected1 = 2;
  t.deepEquals(actual1, expected1, 'the calculatePollTimes works');

  const lastPoll2 = new Date(startPoll - 3600000 * 150);
  const actual2 = calculatePollTimes(startPoll, lastPoll2).length;
  const expected2 = 1;
  t.deepEquals(actual2, expected2, 'the calculatePollTimes works');

  const lastPoll3 = null;
  const actual3 = calculatePollTimes(startPoll, lastPoll3).length;
  const expected3 = 1;
  t.deepEquals(actual3, expected3, 'the calculatePollTimes works');
});
