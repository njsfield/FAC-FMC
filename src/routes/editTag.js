module.exports = {
  method: 'post',
  path: '/edit-tag',
  handler: (request, reply) => {
    reply.redirect('/dashboard');
  }
};
