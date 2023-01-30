const { Pool } = require("pg");
const fs = require("fs");
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASS,
  port: process.env.PG_PORT,
  ssl: true,
  ssl: {
    ca: fs.readFileSync(__dirname + "/ca.crt"),
    rejectUnauthorized: true,
  },
});

module.exports = pool;
