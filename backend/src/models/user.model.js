const db = require('../database/db');

exports.createUser = async (userData) => {

    const sql = `
        INSERT INTO users(name, email, password)
        VALUES (?, ?, ?)
    `;

    const [result] = await db.query(sql, [
        userData.name,
        userData.email,
        userData.password
    ]);

    return result;
};

exports.findByEmail = async (email) => {

    const sql = `
        SELECT * FROM users
        WHERE email = ?
    `;

    const [rows] = await db.query(sql, [email]);

    return rows[0];
};