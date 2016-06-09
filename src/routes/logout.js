module.exports = {
  method: 'GET',
  path: '/logout',
  handler: (request, reply) => {
    reply('logout')
  }
}
