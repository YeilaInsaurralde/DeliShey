const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();


async function initializeDatabase() {
    try {

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true
        });

        const schema = fs.readFileSync(
            path.join(__dirname, 'schema.sql'),
            'utf8'
        );

        const seed = fs.readFileSync(
            path.join(__dirname, 'seed.sql'),
            'utf8'
        );

        await connection.query(schema);
        await connection.query(seed);
        console.log('Database initialized');
        await connection.end();

    } catch (error) {

        console.error(error);

    }
}
initializeDatabase();