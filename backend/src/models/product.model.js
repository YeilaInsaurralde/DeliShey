const db = require('../database/db');//conexion a bd

//trae los productos de base de datos - obtiene todos
exports.findAll = async () => {

    const sql = `
        SELECT *
        FROM products
        ORDER BY id DESC
    `;

    const [rows] =
        await db.query(sql);

    return rows;

};

//busca por id
exports.findById = async (id) => {

    const sql = `
        SELECT *
        FROM products
        WHERE id = ?
    `;

    const [rows] =
        await db.query(sql, [id]);

    return rows[0];

};


//crear productos
exports.create = async (
    productData
) => {

    const sql = `
        INSERT INTO products
        (
            name,
            price,
            category,
            description,
            image
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    const [result] =
        await db.query(sql, [
            productData.name,
            productData.price,
            productData.category,
            productData.description,
            productData.image
        ]);

    return result;
};


//actualiza
exports.update = async (
    id,
    productData
) => {

    const sql = `
        UPDATE products
        SET
            name = ?,
            price = ?,
            category = ?,
            description = ?,
            image = ?
        WHERE id = ?
    `;

    const [result] =
        await db.query(sql, [
            productData.name,
            productData.price,
            productData.category,
            productData.description,
            productData.image,
            id
        ]);

    return result;
};

//eliminar producto
exports.delete = async (id) => {

    const sql = `
        DELETE
        FROM products
        WHERE id = ?
    `;

    const [result] =
        await db.query(sql, [id]);

    return result;

};
