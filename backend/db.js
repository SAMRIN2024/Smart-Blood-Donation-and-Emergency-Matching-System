
require("dotenv").config();

const mysql = require("mysql2");

const db = mysql.createPool({
    host: process.env.TIDB_HOST,
    port: Number(process.env.TIDB_PORT || 4000),
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: {
        minVersion: "TLSv1.2"
    },
    waitForConnections: true,
    connectionLimit: 10
});

db.getConnection((err, connection) => {
    if (err) {
        console.log("Database connection failed:", err.message);
        return;
    }

    console.log("TiDB Database Connected Successfully!");
    connection.release();
});

module.exports = db;
