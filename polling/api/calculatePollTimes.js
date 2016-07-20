module.exports = (startPoll, lastPoll) => {
  const diff = startPoll - lastPoll;
  const hours = diff / 3600000;
  const days = Math.ceil(hours / 24);
  let result = [];
  if (hours < 24) {
    hours += 2;
    while (hours-- > 0) {
      result.push({
        year: startPoll.getFullYear(),
        month: startPoll.getMonth() + 1,
        date: startPoll.getDate(),
        hours: startPoll.getHours()
      });
      startPoll = new Date(startPoll - 3600000);
    }
  } else if (days < 5) {
    while (days-- > 0) {
      result.push({
        year: startPoll.getFullYear(),
        month: startPoll.getMonth() + 1,
        date: startPoll.getDate()
      });
      startPoll = new Date(startPoll - (3600000 * 24));
    }
  } else {
    result.push({});
  }
  return result;
};
