const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "postgres",
  host: "localhost",   // <-- THIS IS THE FIX
  port: 5432,
  database: "salesmanagement"
});

module.exports = pool;
