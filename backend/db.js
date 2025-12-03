const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",   // COORDINATOR IP
  port: 5432,
  user: "postgres",
  password: "postgres",
  database: "salesmanagement"
});


module.exports = pool;
