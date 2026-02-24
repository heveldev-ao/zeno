require("dotenv").config();

const env = process.env.NODE_ENV || "development";

let pool;

if (env === "production") {
  const { Pool } = require("pg");

  pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    ssl: { rejectUnauthorized: false },
    max: 10,
  });

  console.log("Banco utilizado: PostgreSQL (PRODUÇÃO)");
} else {
  const mariadb = require("mariadb");

  pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    connectionLimit: 10,
  });

  console.log("Banco utilizado: MariaDB (DESENVOLVIMENTO)");
}

module.exports = pool;