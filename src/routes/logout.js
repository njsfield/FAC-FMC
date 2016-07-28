module.exports = {
  method: 'GET',
  path: '/logout',
  config: {auth: false},
  handler: (request, reply) => {
    return reply.redirect('/').unstate('FMC');
  }
};
