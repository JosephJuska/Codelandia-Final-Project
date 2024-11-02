const { Pool } = require('pg');

const dbConfig = require('../config/db');

const pool = new Pool({
    user: dbConfig.DB_USER,
    host: dbConfig.DB_HOST,
    password: dbConfig.DB_PASSWORD,
    port: dbConfig.DB_PORT,
    database: dbConfig.DB_DATABASE
});

module.exports = pool;