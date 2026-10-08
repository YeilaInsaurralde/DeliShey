const db = require('../database/db');

// Verifica si el usuario compró el producto (requisito para poder calificar)
exports.userBoughtProduct = async (userId, productId) => {

    const sql = `
        SELECT oi.id
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        WHERE o.user_id = ? AND oi.product_id = ?
        LIMIT 1
    `;

    const [rows] = await db.query(sql, [userId, productId]);

    return rows.length > 0;

};

// Crea la calificación, o la actualiza si el usuario ya había calificado ese producto
exports.upsert = async (userId, productId, rating, comment) => {

    const sql = `
        INSERT INTO product_ratings (user_id, product_id, rating, comment)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment)
    `;

    await db.query(sql, [userId, productId, rating, comment || null]);

};

// Promedio y cantidad de calificaciones de un producto (para mostrar en la tienda)
exports.getProductSummary = async (productId) => {

    const sql = `
        SELECT
            ROUND(AVG(rating), 1) AS avg_rating,
            COUNT(*) AS total_ratings
        FROM product_ratings
        WHERE product_id = ?
    `;

    const [rows] = await db.query(sql, [productId]);

    return rows[0];

};

// Reseñas (con comentario) de un producto, para mostrar públicamente
exports.getProductReviews = async (productId) => {

    const sql = `
        SELECT pr.rating, pr.comment, pr.created_at, u.name AS user_name
        FROM product_ratings pr
        JOIN users u ON u.id = pr.user_id
        WHERE pr.product_id = ?
        ORDER BY pr.created_at DESC
    `;

    const [rows] = await db.query(sql, [productId]);

    return rows;

};

// Productos que compró el usuario, con su propia calificación si ya puso una (para "Mis compras")
exports.getUserPurchasedProducts = async (userId) => {

    const sql = `
        SELECT DISTINCT
            p.id, p.name, p.image,
            pr.rating, pr.comment
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        JOIN products p ON p.id = oi.product_id
        LEFT JOIN product_ratings pr
            ON pr.product_id = oi.product_id AND pr.user_id = o.user_id
        WHERE o.user_id = ?
        ORDER BY p.name
    `;

    const [rows] = await db.query(sql, [userId]);

    return rows;

};