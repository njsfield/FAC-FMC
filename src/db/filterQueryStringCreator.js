'use strict';

const queryFields = `SELECT TO_CHAR(calls.date, 'DD Mon YY HH24:MI') AS date, calls.duration, calls.call_id, calls.file_id, calls.company_id,
   p1.participant_id AS caller_id, p1.internal AS caller_internal, p1.number AS caller_number, p1.contact_id AS caller_contact,
   p2.participant_id AS callee_id, p2.internal AS callee_internal, p2.number AS callee_number, p2.contact_id AS callee_contact,
   array(select tag_name from tags where tag_id in (select tag_id from tags_calls where tags_calls.call_id = calls.call_id)) AS tag_name`;

const joinBase =
   `LEFT JOIN participants p1 ON calls.call_id = p1.call_id AND p1.participant_role = 'caller'
    LEFT JOIN participants p2 ON calls.call_id = p2.call_id AND p2.participant_role = 'callee' `;

const toString2 = 'p2.number =';
const fromString = 'p1.number =';

const untaggedCalls = 'NOT EXISTS (SELECT 1 FROM tags_calls WHERE tags_calls.call_id = calls.call_id)';
const taggedCalls = ' calls.call_id IN (select call_id from tags_calls where tag_id IN (select tag_id from tags where ';

const buildBasicSQL = (obj, queryArr) => {
  // What joins do we want?
  var stringArray = [queryFields];

  if (!obj.isAdmin && !obj.isManager) {
    queryArr.push(obj.contactID);
    stringArray.push(', owned.hidden AS hidden FROM calls');
    stringArray.push(`INNER JOIN participants owned ON calls.call_id = owned.call_id AND owned.contact_id=$${queryArr.length}`);
    if (!obj.includeHidden)
      stringArray.push('AND owned.hidden=false');
  }
  else {
    stringArray.push(', false AS hidden FROM calls');
  }
  stringArray.push(joinBase,'WHERE');
  return stringArray.join(' ');
};

const toAndFromQueryStringCreator = (obj, queryArr, tests) => {
  if (obj.to !== '' && obj.from !== '') {
    queryArr.push(obj.to, obj.from);
    tests.push(`${toString2}$${queryArr.length - 1} AND ${fromString}$${queryArr.length}`);
  }
  else if (obj.to !== '') {
    queryArr.push(obj.to);
    tests.push(`${toString2}$${queryArr.length}`);
  }
  else if (obj.from !== '') {
    queryArr.push(obj.from);
    tests.push(`${fromString}$${queryArr.length}`);
  }
};

const minAndMaxQueryStringCreator = (obj, queryArr, tests) => {
  if (obj.min !== '' && obj.max !== '') {
    queryArr.push(obj.min * 60, obj.max * 60);
    tests.push(`duration BETWEEN $${queryArr.length -1} AND $${queryArr.length}`);
  }
  else if (obj.min !== '') {
    queryArr.push(obj.min * 60);
    tests.push(`duration >= $${queryArr.length}`);
  }
  else if (obj.max !== '') {
    queryArr.push(obj.max * 60);
    tests.push(`duration <= $${queryArr.length}`);
  }
};

const makeDateString = function(date) {
  return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
};
const dateQueryStringCreator = (obj, queryArr, tests) => {
  console.log("DATE TESTS: ", obj.date, obj.dateRange);

  if (obj.startDate!=null && obj.endDate!=null) {
    queryArr.push(makeDateString(obj.startDate), makeDateString(obj.endDate));
    tests.push(`date::date BETWEEN $${queryArr.length-1} AND $${queryArr.length}`);
  }
  else if (obj.startDate) {
    // EXACT date match
    queryArr.push(makeDateString(obj.startDate));
    tests.push(`date::date = $${queryArr.length }`);
  }
};

const taggedCallsStringCreator = (obj, queryArr, tests) => {
  let tagsQueryArray = [];
  if (obj.untagged === true) {
    tests.push(untaggedCalls);
  }
  else if (obj.tags.length >0 ) {
    obj.tags.forEach((tag) => {
      queryArr.push(tag);
      tagsQueryArray.push('tag_name=' + '$' + queryArr.length);
    });
    tests.push(taggedCalls + tagsQueryArray.join(' OR ') + '))');
  }
};

const limitCallsCreator = (obj, queryArr, order) => {
  var sequel = '';

  if (obj.maxRows < 1 || obj.maxRows > 100) {
    obj.maxRows = 20;
  }

  // queryArr.push(obj.dateOrder);
  queryArr.push(obj.maxRows + 1);

  // sequel += ` ORDER BY calls.date $${queryArr.length-1} LIMIT $${queryArr.length}`;
  sequel += ' ORDER BY calls.date ' + order + ' LIMIT $' + queryArr.length;

  if (obj.firstIndex > 0) {
    queryArr.push(obj.firstIndex);
    sequel += ' OFFSET $' + queryArr.length;
  }
  return sequel;
};

/**
 * Fetches an array of call objects to be rendered in the dashboard view.
 * @param {obj} an object for example:
 * {
   contact_id: 4387735,
   company_id: 101,
   filters: {
     to: 239,
     from: '',
     min: '',
     max: '',
     date: '',
     tags: ''
   }
 };
 * @param {queryString} string -
 * 'select date, file_id, contact_id, participant_role, number, internal, duration, tag_id \n
 * from participants p inner join calls c on p.call_id = c.call_id and p.company_id = c.company_id \n
 * left join tags_calls t on c.call_id = t.call_id where '
 * @param {callback} function - returns the completed query string. Example: for a minimum
 * length of 8 seconds and to the number 239:
 * 'select date, file_id, contact_id, participant_role, number, internal, duration, tag_id \n
 * from participants p inner join calls c on p.call_id = c.call_id and p.company_id = c.company_id \n
 * left join tags_calls t on c.call_id = t.call_id where participant_role = ('callee') and number = ('239') \n
 * and duration >= ('8')'
 */

const createQueryString = (queryArr, obj, dateOrder) => {
  const testArr = [];
  const baseQuery = buildBasicSQL(obj, queryArr);
  const individual = (!obj.isAdmin && !obj.isManager);

  // Must scope all requests to a company. For a normal user that will be the company to which they belong. For
  // an administrator is will the the 'adminCompany', if present. Otherwise it will again drop back to company_id.

  if (individual) {
    queryArr.push(obj.company_id);
    testArr.push(`calls.company_id = $${queryArr.length}`);
    // queryArr.push(obj.contactID);
    // testArr.push(`( p1.contact_id=$${queryArr.length} OR p2.contact_id=$${queryArr.length})`);
  }
  else if (obj.isAdmin && obj.adminCompany!=null && obj.adminCompany.search(/\S/)>=0) {
    queryArr.push(obj.adminCompany);
    testArr.push(`calls.company_id = (SELECT company_id FROM companies WHERE company_name=$${queryArr.length})`);
  }
  else {
    // Invalid parameters - make sure the result set is empty.
    testArr.push('false');
  }

  toAndFromQueryStringCreator(obj, queryArr, testArr);
  minAndMaxQueryStringCreator(obj, queryArr, testArr);
  dateQueryStringCreator(obj, queryArr, testArr);
  taggedCallsStringCreator(obj, queryArr, testArr);

  var fullQueryString = baseQuery+ ' '+testArr.join(' AND ');
  return fullQueryString + limitCallsCreator(obj, queryArr, dateOrder);
};

module.exports = {
  toAndFromQueryStringCreator,
  minAndMaxQueryStringCreator,
  dateQueryStringCreator,
  taggedCallsStringCreator,
  createQueryString,
  limitCallsCreator
};
