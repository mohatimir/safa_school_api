const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create a connection pool instead of a single connection
// This handles multiple concurrent requests better and automatically manages connections
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to Aiven Database:', err.message);
    } else {
        console.log('Successfully connected to Aiven Database via SSL!');
        connection.release();
    }
});

module.exports = pool.promise();
