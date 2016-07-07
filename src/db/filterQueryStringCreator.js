'use strict';

const toString2 = 'participants2.number =';
const fromString = 'participants1.number =';
const minTimeString = 'duration >=';
const maxTimeString = 'duration <=';

const dateString = 'date > ';
const datePlusOneString = 'and date < (select timestamp with time zone \'epoch\' + ';
const datePlusOneStringEnd = ' * interval \'1\' second)';

const untaggedCalls = 'NOT EXISTS (SELECT 1 FROM tags_calls WHERE tags_calls.call_id = calls.call_id)';
// const queryString = 'select date, file_id, contact_id, participant_role, number, internal, duration, tag_id from participants p inner join calls c on p.call_id = c.call_id and p.company_id = ($1) and p.contact_id = ($2) left join tags_calls t on c.call_id = t.call_id where ';

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
    queryArr.push(obj.min, obj.max);
    callback(queryArr, `${minTimeString}$${queryArr.length -1} AND ${maxTimeString}$${queryArr.length}`);
  }
  else if (obj.min !== '') {
    queryArr.push(obj.min);
    callback(queryArr, `${minTimeString}$${queryArr.length}`);
  }
  else if (obj.max !== '') {
    queryArr.push(obj.max);
    callback(queryArr, `${maxTimeString}$${queryArr.length}`);
  }
  else {
    callback(queryArr);
  }
};

const dateQueryStringCreator = (obj, queryArr, callback) => {
  const dateMillis = (new Date(obj.date).getTime() + 86400000)/1000;
  if (obj.date !== '') {
    queryArr.push(obj.date);
    // const filter = obj.date + '\') ';
    const string = dateString + '$' + queryArr.length + datePlusOneString + dateMillis + datePlusOneStringEnd;
    callback(queryArr, string);
  }
  else {
    callback(queryArr);
  }
};

const untaggedCallsStringCreator = (obj, callback) => {
  if (obj.to === '' && obj.from === '' && obj.min === '' && obj.max === '' && obj.date === '' && obj.tags === '') {
    callback(untaggedCalls);
  }
  else {
    callback();
  }
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

const createQueryString = (queryString, queryArr, obj, callback) => {
  let stringArr = [];

  toAndFromQueryStringCreator(obj, queryArr, (qa2, filters) => {
    if (filters !== undefined) stringArr.push(filters);

    minAndMaxQueryStringCreator(obj, qa2, (qa3, filters2) => {
      if (filters2 !== undefined) stringArr.push(filters2);

      dateQueryStringCreator(obj, qa3, (qa4, filters3) => {
        if (filters3 !== undefined) stringArr.push(filters3);

        untaggedCallsStringCreator(obj, (filters4) => {
          if (filters4 !== undefined) stringArr.push(filters4);

          const fullQueryString = queryString += stringArr.join(' and ');
          callback(fullQueryString, qa4);
        });
      });
    });
  });
};

// const toAndFromQueryStringCreator = (obj, queryArr, callback) => {
//
//   if (obj.to !== '' && obj.from !== '') {
//     queryArr.push(obj.to);
//     let str = `${toString2}$${queryArr.length}`;
//     queryArr.push(obj.from);
//     str += `$${queryArr.length}`;
//     callback(str, queryArr);
//     // `${fromAndTo}$${queryArr.length}\', \'${obj.from}\')`
//   }
//   else if (obj.to !== '') {
//     // const filter = obj.to + '\') ';
//     // const string = callsToString + filter;
//     callback(toString2);
//   }
//   else if (obj.from !== '') {
//     const filter = obj.from + '\') ';
//     const string = callsFromString + filter;
//     callback(string);
//   }
//   else {
//     callback();
//   }
// };
module.exports = {
  toAndFromQueryStringCreator,
  minAndMaxQueryStringCreator,
  dateQueryStringCreator,
  untaggedCallsStringCreator,
  createQueryString
};
