const { Pool } = require("pg");

const pool = new Pool({
  host: "127.0.0.1",   // COORDINATOR IP
  port: 5432,
  user: "postgres",
  password: "postgres",
  database: "salesmanagement"
});


module.exports = pool;
