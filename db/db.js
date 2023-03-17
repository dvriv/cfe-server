// Make sure to have the env variables
const knex = require("knex")({
  client: "pg",
  connection: process.env.PG_CONNECTION_STRING,
  pool: { min: 0, max: 10, acquireTimeoutMillis: 300000, }
});

module.exports = knex;
