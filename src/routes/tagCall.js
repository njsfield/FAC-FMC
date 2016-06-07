module.exports = {
  method: 'post',
  path: '/tag-call',
  handler: (request, reply) => {
    reply.redirect('/dashboard')
  }
}
