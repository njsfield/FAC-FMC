insertData.addToUsersTable(dbClient, obj.addToUsersTable, (res) => {
  const actual = res.command;
  t.deepEqual(actual, expected, 'added to users table');
  done();
});
insertData.addToTagsTable(dbClient, obj.addToTagsTable, (res) => {
  const expected = 100;
  const actual = res;
  t.deepEqual(actual, expected, 'added to tags table');
  done();
});
insertData.addToTagsCallsTable(dbClient, obj.addToTagsCallsTable, (res) => {
  const actual = res.command;
  t.deepEqual(actual, expected, 'added to tagsCalls table');
  done();
});
insertData.addToFiltersTable(dbClient, obj.addToFiltersTable, (res) => {
  const actual = res.command;
  t.deepEqual(actual, expected, 'added to filters table');
  done();
});

// insertData.editTagsTable(dbClient, obj.editTagsTable, (res) => {
//   const actual = res.command;
//   const expected2 = 'UPDATE';
//   t.deepEqual(actual, expected2, 'added to tagsCalls table');
//   done();
// });

addToTagsTable: {
  company_id: 100,
  tag_name: 'urgent'
},


addToTagsCallsTable: {
  call_id: 101,
  tag_id: 100
},
addToFiltersTable: {
  filter_name: 'newest-test-filter',
  contact_id: 238,
  filter_spec: {
    to: 100,
    from: '',
    min: '',
    max: '',
    date: '',
    tags: ''
  }
}
