const mysql2 = require("mysql2");

// Create a connection pool
const dbConnectionPool = mysql2.createPool({
    user: process.env.USER,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    password: process.env.PASSWORD,
    connectionLimit: 10
});
console.log(process.env.DB_NAME);

// Create a promise for the pool
const dbConnectionPromise = dbConnectionPool.promise();

module.exports = {
    dbConnectionPool,
    dbConnectionPromise
};
