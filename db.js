const Pool = require('pg').Pool;
const config = require('./config/default');

const pool = new Pool({
  user: config.dbUser,
  password: config.dbPassword,
  host: config.dbHost,
  port: 5432,
  database: config.dbDatabase,
  ssl: 'required',
});

module.exports = pool;
