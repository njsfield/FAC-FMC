const Hapi = require('hapi');
const Server = new Hapi.Server();
const port = process.env.PORT || 3000;
const views = require('./views.js');
const validate = require('../auth/validate.js');

const plugins = [
  require('inert'),
  require('vision'),
  require('hapi-auth-jwt2')
];

const routes = [
  require('../routes/login.js'),
  require('../routes/dashboard.js'),
  require('../routes/dashboard2.js'),
  require('../routes/editTag.js'),
  require('../routes/fetchAudio.js'),
  require('../routes/filteredCalls.js'),
  require('../routes/index.js'),
  require('../routes/logout.js'),
  require('../routes/schema.js'),
  require('../routes/tagCall.js'),
  require('../routes/publicdir.js'),
  require('../routes/saveFilter.js')
];

Server.connection({port});

Server.register(plugins, (error) => {
  if (error) throw error;

  Server.views(views);

  Server.route(routes);

  Server.auth.strategy('jwt', 'jwt',
    { key: process.env.JWT_KEY,
      validateFunc: validate,
      verifyOptions: { algorithms: [ 'HS256' ] }
    });

  Server.auth.default('jwt');
});

module.exports = Server;
