// Make sure to have the env variables

const knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDBCFEPASIVOS,
  },
});

module.exports = knex;
