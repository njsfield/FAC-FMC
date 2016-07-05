'use strict';

const fromAndTo = 'participant_role in (\'callee\', \'caller\') and number in (\'';
const minAndMax = 'duration in (\'';
const callsToString = 'participant_role = (\'callee\') and number = (\'';
const callsFromString = 'participant_role = (\'caller\') and number = (\'';
const minTimeString = 'duration >= (\'';
const maxTimeString = 'duration <= (\'';
const dateString = 'date > (\'';
const datePlusOneString = 'and date < (select timestamp with time zone \'epoch\' + ';
const datePlusOneStringEnd = ' * interval \'1\' second)';
const untaggedCalls = 'tag_id is NULL';
// const queryString = 'select date, file_id, contact_id, participant_role, number, internal, duration, tag_id from participants p inner join calls c on p.call_id = c.call_id and p.company_id = ($1) and p.contact_id = ($2) left join tags_calls t on c.call_id = t.call_id where ';

const toAndFromQueryStringCreator = (obj, callback) => {
  if (obj.to !== '' && obj.from !== '') {
    callback(`${fromAndTo}${obj.to}\', \'${obj.from}\')`);
  }
  else if (obj.to !== '') {
    const filter = obj.to + '\') ';
    const string = callsToString + filter;
    callback(string);
  }
  else if (obj.from !== '') {
    const filter = obj.from + '\') ';
    const string = callsFromString + filter;
    callback(string);
  }
  else {
    callback();
  }
};

const minAndMaxQueryStringCreator = (obj, callback) => {
  if (obj.min !== '' && obj.max !== '') {
    callback(`${minAndMax}${obj.min}\', \'${obj.max}\')`);
  }
  else if (obj.min !== '') {
    const filter = obj.min + '\') ';
    const string = minTimeString + filter;
    callback(string);
  }
  else if (obj.max !== '') {
    const filter = obj.max += '\') ';
    const string = maxTimeString + filter;
    callback(string);
  }
  else {
    callback();
  }
};

const dateQueryStringCreator = (obj, callback) => {
  const dateMillis = (new Date(obj.date).getTime() + 86400000)/1000;
  if (obj.date !== '') {
    const filter = obj.date + '\') ';
    const string = dateString + filter + datePlusOneString + dateMillis + datePlusOneStringEnd;
    callback(string);
  }
  else {
    callback();
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

const createQueryString = (queryString, obj, callback) => {
  var queryArr = [];
  toAndFromQueryStringCreator(obj, (filters) => {
    if (filters !== undefined) queryArr.push(filters);

    minAndMaxQueryStringCreator(obj, (filters2) => {
      if (filters2 !== undefined) queryArr.push(filters2);

      dateQueryStringCreator(obj, (filters3) => {
        if (filters3 !== undefined) queryArr.push(filters3);

        untaggedCallsStringCreator(obj, (filters4) => {
          if (filters4 !== undefined) queryArr.push(filters4);

          const fullQueryString = queryString += queryArr.join(' and ');
          callback(fullQueryString);
        });
      });
    });
  });
};

module.exports = {
  toAndFromQueryStringCreator,
  minAndMaxQueryStringCreator,
  dateQueryStringCreator,
  untaggedCallsStringCreator,
  createQueryString
};
