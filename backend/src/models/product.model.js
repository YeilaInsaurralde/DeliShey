const db = require('../database/db');//conexion a bd

//trae los productos ACTIVOS (los que ve el público)
exports.findAll = async () => {

    const sql = `
        SELECT *
        FROM products
        WHERE is_active = TRUE
        ORDER BY id DESC
    `;

    const [rows] =
        await db.query(sql);

    return rows;

};

//trae TODOS los productos, activos e inactivos (solo para el admin)
exports.findAllAdmin = async () => {

    const sql = `
        SELECT *
        FROM products
        ORDER BY id DESC
    `;

    const [rows] =
        await db.query(sql);

    return rows;

};

//busca por id (no filtra por estado: el service decide qué mostrar)
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


//crear productos (si no viene is_active, queda activo)
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
            image,
            is_active
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] =
        await db.query(sql, [
            productData.name,
            productData.price,
            productData.category,
            productData.description,
            productData.image,
            productData.is_active ?? true
        ]);

    return result;
};


//actualiza (si no viene is_active, se conserva el que ya tenía)
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
            image = ?,
            is_active = COALESCE(?, is_active)
        WHERE id = ?
    `;

    const [result] =
        await db.query(sql, [
            productData.name,
            productData.price,
            productData.category,
            productData.description,
            productData.image,
            productData.is_active ?? null,
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

//category (solo productos activos)
exports.findByCategory =
async (category) => {

    const sql = `
        SELECT *
        FROM products
        WHERE category = ?
        AND is_active = TRUE
        ORDER BY id DESC
    `;

    const [rows] =
        await db.query(
            sql,
            [category]
        );

    return rows;

};