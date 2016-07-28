module.exports = {
  method: 'post',
  path: '/edit-tag',
  config: {auth: false},
  handler: (request, reply) => {
    if (request.state.FMC) {
      reply.redirect('/dashboard');
    } else {
      return reply.redirect('/');
    }
  }
};
