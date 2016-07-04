'use strict';

var fromAndTo = 'participant_role in (\'callee\', \'caller\') and number in (\'';
var minAndMax = 'duration in (\'';
var callsToString = 'participant_role = (\'callee\') and number = (\'';
var callsFromString = 'participant_role = (\'caller\') and number = (\'';
var minTimeString = 'duration >= (\'';
var maxTimeString = 'duration <= (\'';
var dateString = 'date > (\'';
var datePlusOneString = 'and date < (select timestamp with time zone \'epoch\' + ';
var datePlusOneStringEnd = ' * interval \'1\' second)';
var untaggedCalls = 'tag_id is NULL';
var queryString = 'select date, file_id, contact_id, participant_role, number, internal, duration, tag_id from participants p inner join calls c on p.call_id = c.call_id and p.company_id = c.company_id left join tags_calls t on c.call_id = t.call_id where ';

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

const createQueryString = (obj, queryString, callback) => {
  var queryArr = [];
  toAndFromQueryStringCreator(obj.filters, (filters) => {
    queryArr.push(filters);
    minAndMaxQueryStringCreator(obj.filters, (filters2) => {
      queryArr.push(filters2);
      dateQueryStringCreator(obj.filters, (filters3) => {
        queryArr.push(filters3);
        untaggedCallsStringCreator(obj.filters, (filters4) => {
          queryArr.push(filters4);
        });
      });
    });
  });
  const fullQueryString = queryString += queryArr.join(' and ');
  callback(fullQueryString);
};

const toAndFromQueryStringCreator = (obj, callback) => {
  if (obj.to !== '' && obj.from !== '') {
    callback(`${fromAndTo}${obj.to}\', \'${obj.from}\')`);
  }
  else if (obj.to !== '') {
    obj.to += '\') ';
    callsToString += obj.to;
    callback(callsToString);
  }
  else if (obj.from !== '') {
    obj.from += '\') ';
    callsFromString += obj.from;
    callback(callsFromString);
  }
};

const minAndMaxQueryStringCreator = (obj, callback) => {
  if (obj.min !== '' && obj.max !== '') {
    callback(`${minAndMax}${obj.min}\', \'${obj.max}\')`);
  }
  else if (obj.min !== '') {
    obj.min += '\') ';
    minTimeString += obj.min;
    callback(minTimeString);
  }
  else if (obj.max !== '') {
    obj.max += '\') ';
    maxTimeString += obj.max;
    callback(maxTimeString);
  }
};

const dateQueryStringCreator = (obj, callback) => {
  const dateMillis = (new Date(obj.date).getTime() + 86400000)/1000;
  if (obj.date !== '') {
    obj.date += '\') ';
    callback(dateString += obj.date + datePlusOneString + dateMillis + datePlusOneStringEnd);
  }
};

const untaggedCallsStringCreator = (obj, callback) => {
  if (obj.to === '' && obj.from === '' && obj.min === '' && obj.max === '' && obj.date === '' && obj.tags === '') {
    callback(untaggedCalls);
  }
};

module.exports = {
  toAndFromQueryStringCreator,
  minAndMaxQueryStringCreator,
  dateQueryStringCreator,
  untaggedCallsStringCreator,
  fetchCalls
};
