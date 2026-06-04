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

exports.saveResetToken = async (
    email,
    token,
    expiration
) => {

    const sql = `
        UPDATE users
        SET reset_token = ?,
            reset_token_expiration = ?
        WHERE email = ?
    `;

    await db.query(
        sql,
        [token, expiration, email]
    );

};

exports.findByResetToken = async (
    token
) => {

    const sql = `
        SELECT *
        FROM users
        WHERE reset_token = ?
        AND reset_token_expiration > NOW()
    `;

    const [rows] = await db.query(
        sql,
        [token]
    );

    return rows[0];

};

exports.updatePassword = async (
    userId,
    hashedPassword
) => {

    const sql = `
        UPDATE users
        SET password = ?,
            reset_token = NULL,
            reset_token_expiration = NULL
        WHERE id = ?
    `;

    await db.query(
        sql,
        [hashedPassword, userId]
    );

};