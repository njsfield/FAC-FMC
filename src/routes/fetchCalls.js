module.exports = {
  method: 'GET',
  path: '/fetch-calls',
  handler: (request, reply) => {
    reply('fetchCalls')
  }
}
