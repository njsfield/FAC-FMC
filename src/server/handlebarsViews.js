const handlebars = require('handlebars');

module.exports = {
  engines: { html: handlebars },
  relativeTo: __dirname + '/../../public/',
  path: 'views',
  layoutPath: './views/layout',
  partialsPath: './views/partials',
  layout: 'default'
};
