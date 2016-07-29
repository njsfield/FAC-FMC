module.exports = {
  method: 'GET',
  path: '/error/{error}',
  config: {auth: false},
  handler: (request, reply) => {
    console.log(request.params);
    reply.view('error', request.params);
  }
};
