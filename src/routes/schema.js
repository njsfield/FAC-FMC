const fs = require('fs');
const schema = require('../db/getSchema.js');

const connectionString = process.env.POSTGRES_URL;
const sql = fs.readFileSync(`${__dirname}/../../schema.txt`).toString();

module.exports = {
  method: 'GET',
  path: '/schema',
  config: { auth: false },
  handler: (request, reply) => {
    schema.getSchema(connectionString, sql);
    reply('schema');
  }
};
