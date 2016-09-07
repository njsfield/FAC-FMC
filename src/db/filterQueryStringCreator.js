'use strict';

const queryString = `SELECT TO_CHAR(calls.date, 'DD Mon YY HH24:MI:SS') AS date, calls.duration, calls.call_id, calls.file_id, calls.company_id,
   participants1.participant_id AS caller_id, participants1.internal AS caller_internal, participants1.number AS caller_number, participants1.contact_id AS caller_contact,
   participants2.participant_id AS callee_id, participants2.internal AS callee_internal, participants2.number AS callee_number, participants2.contact_id AS callee_contact,
   array(select tag_name from tags where tag_id in (select tag_id from tags_calls where tags_calls.call_id = calls.call_id)) AS tag_name
FROM calls
    LEFT JOIN participants participants1 ON calls.call_id = participants1.call_id AND participants1.participant_role = 'caller'
    LEFT JOIN participants participants2 ON calls.call_id = participants2.call_id AND participants2.participant_role = 'callee'
WHERE `;

const toString2 = 'participants2.number =';
const fromString = 'participants1.number =';
const minTimeString = 'duration >=';
const maxTimeString = 'duration <=';

const dateString = 'date > ';
const datePlusOneString = 'and date < (select timestamp with time zone \'epoch\' + ';
const datePlusOneStringEnd = ' * interval \'1\' second)';

const untaggedCalls = 'NOT EXISTS (SELECT 1 FROM tags_calls WHERE tags_calls.call_id = calls.call_id)';
const taggedCalls = ' calls.call_id IN (select call_id from tags_calls where tag_id IN (select tag_id from tags where ';

const toAndFromQueryStringCreator = (obj, queryArr, callback) => {
  if (obj.to !== '' && obj.from !== '') {
    queryArr.push(obj.to, obj.from);
    callback(queryArr, `${toString2}$${queryArr.length - 1} AND ${fromString}$${queryArr.length}`);
  }
  else if (obj.to !== '') {
    queryArr.push(obj.to);
    callback(queryArr, `${toString2}$${queryArr.length}`);
  }
  else if (obj.from !== '') {
    queryArr.push(obj.from);
    callback(queryArr, `${fromString}$${queryArr.length}`);
  }
  else {
    callback(queryArr);
  }
};

const minAndMaxQueryStringCreator = (obj, queryArr, callback) => {
  if (obj.min !== '' && obj.max !== '') {
    queryArr.push(obj.min * 60, obj.max * 60);
    callback(queryArr, `${minTimeString}$${queryArr.length -1} AND ${maxTimeString}$${queryArr.length}`);
  }
  else if (obj.min !== '') {
    queryArr.push(obj.min * 60);
    callback(queryArr, `${minTimeString}$${queryArr.length}`);
  }
  else if (obj.max !== '') {
    queryArr.push(obj.max * 60);
    callback(queryArr, `${maxTimeString}$${queryArr.length}`);
  }
  else {
    callback(queryArr);
  }
};

const dateQueryStringCreator = (obj, queryArr, callback) => {
  const selectedDatePlusNumSecondsInDay = (new Date(obj.date).getTime() + 86400000)/1000;
  const selectedDateRangePlusNumSecondsInDay = (new Date(obj.dateRange).getTime() + 86400000)/1000;

  if (obj.date !== '' && obj.dateRange !== '') {
    queryArr.push(obj.date, selectedDateRangePlusNumSecondsInDay);
    const string = `${dateString}$${queryArr.length - 1}${datePlusOneString}$${queryArr.length}${datePlusOneStringEnd}`;
    callback(queryArr, string);
  }
  else if (obj.date !== '') {
    queryArr.push(obj.date);
    const string = dateString + '$' + queryArr.length + datePlusOneString + selectedDatePlusNumSecondsInDay + datePlusOneStringEnd;
    callback(queryArr, string);
  }
  else {
    callback(queryArr);
  }
};

const taggedCallsStringCreator = (obj, queryArr, callback) => {
  let tagsQueryArray = [];
  if (obj.untagged === true) {
    callback(queryArr, untaggedCalls);
  }
  else if (obj.tags.length < 1) {
    callback(queryArr);
  }
  else {
    obj.tags.forEach((tag) => {
      queryArr.push(tag);
      tagsQueryArray.push('tag_name=' + '$' + queryArr.length);
    });
    callback(queryArr, taggedCalls + tagsQueryArray.join(' OR ') + '))');
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

const createQueryString = (queryArr, obj, dateOrder, callback) => {
  let stringArr = [];

  // Must scope all requests to a company. For a normal user that will be the company to which they belong. For
  // an administrator is will the the 'adminCompany', if present. Otherwise it will again drop back to company_id.

  if (obj.isAdmin!==true) {
    queryArr.push(obj.company_id);
    stringArr.push(`calls.company_id = $${queryArr.length}`);
    queryArr.push(obj.contactID);
    stringArr.push(`( participants1.contact_id=$${queryArr.length} OR participants2.contact_id=$${queryArr.length})`);
  }
  else if (obj.adminCompany!=null && obj.adminCompany.search(/\S/)>=0) {
    queryArr.push(obj.adminCompany);
    stringArr.push(`calls.company_id = (SELECT company_id FROM companies WHERE company_name=$${queryArr.length})`);
  }
  else {
    // Invalid parameters - make sure the result set is empty.
    stringArr.push('false');
  }

  toAndFromQueryStringCreator(obj, queryArr, (qa2, filters) => {
    if (filters) stringArr.push(filters);

    minAndMaxQueryStringCreator(obj, qa2, (qa3, filters2) => {
      if (filters2) stringArr.push(filters2);

      dateQueryStringCreator(obj, qa3, (qa4, filters3) => {
        if (filters3) stringArr.push(filters3);

        taggedCallsStringCreator(obj, qa4, (qa5, filters4) => {
          if (filters4) stringArr.push(filters4);

          var fullQueryString = queryString + ' '+stringArr.join(' AND ');
          fullQueryString += limitCallsCreator(obj, qa5, dateOrder);
          callback(fullQueryString, qa5);
        });
      });
    });
  });
};

module.exports = {
  toAndFromQueryStringCreator,
  minAndMaxQueryStringCreator,
  dateQueryStringCreator,
  taggedCallsStringCreator,
  createQueryString,
  limitCallsCreator
};
