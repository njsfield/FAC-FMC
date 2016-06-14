module.exports = {
  method: 'GET',
  path: '/fetch-calls',
  handler: (request, reply) => {
    // params = user, quantity
    reply('fetchCalls')
  }
}
