module.exports = {
  method: 'GET',
  path: '/{param*}',
  config: {auth: false},
  handler: {
    directory: {
      path: 'public/'
    }
  }
};
