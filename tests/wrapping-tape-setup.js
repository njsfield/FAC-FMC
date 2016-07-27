const tape = require('wrapping-tape');
const pg = require('pg');

const databaseTest = tape({
  setup: function(t) {
    t.end();
  },
  teardown: function(t) {
    pg.end();
    t.end();
  }
});

const test = tape({
  setup: function(t) {
    t.end();
  },
  teardown: function(t) {
    t.end();
  }
});

module.exports = {
  databaseTest,
  tape,
  test
};
