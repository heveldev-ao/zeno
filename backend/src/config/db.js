const mariadb = require("mariadb");
require("dotenv").config();
const { Pool } = require("pg");

// Pool para ambiente de desenvolvimento
const devPool = new Pool({
  host: process.env.DEV_DB_HOST,
  user: process.env.DEV_DB_USER,
  password: process.env.DEV_DB_PASSWORD,
  database: process.env.DEV_DB_NAME,
  port: process.env.DEV_DB_PORT || 5432,
  max: 10,
});

// Pool para ambiente de produção
const prodPool = new Pool({
  host: process.env.PROD_DB_HOST,
  user: process.env.PROD_DB_USER,
  password: process.env.PROD_DB_PASSWORD,
  database: process.env.PROD_DB_NAME,
  port: process.env.PROD_DB_PORT || 5432,
  max: 10,
});

// Escolhe o pool baseado no NODE_ENV
const pool = process.env.NODE_ENV === "production" ? prodPool : devPool;

module.exports = pool;
