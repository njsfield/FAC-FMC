module.exports = {
  method: 'GET',
  path: '/logout',
  handler: (request, reply) => {
    return reply.redirect('/').unstate('token');
  }
};
