
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

require('dotenv').config();

async function initializeDatabase() {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT || 3306),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true
        });

        const schema = fs.readFileSync(
            path.join(__dirname, 'schema.sql'),
            'utf8'
        );

        // Crear las tablas
        await connection.query(schema);

        // Crear únicamente los roles necesarios
        await connection.query(`
    INSERT IGNORE INTO roles (id, name)
    VALUES (1, 'admin'), (2, 'client')
`);

        console.log('Database initialized successfully');

    } catch (error) {
        console.error('Database initialization error:', error);
        process.exitCode = 1;

    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

initializeDatabase();
