module.exports = {
  method: 'GET',
  path: '/error/{error}',
  config: {auth: false},
  handler: (request, reply) => {
    reply.view('error', request.params);
  }
};
