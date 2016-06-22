const tape = require('tape');
const pollCalls = require('../../polling/api/polling_calls_api.js');

tape('test that the api polling works ', (t) => {
  t.plan(1);
  pollCalls.updateFileNames('default', (files) => {
    const expected = 'something';
    const actual = files;
    t.deepEqual(expected, actual , 'congrats, polling f the caller complete');
  });
});
