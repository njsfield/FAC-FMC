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
  untaggedCallsStringCreator
};
