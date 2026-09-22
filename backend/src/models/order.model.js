const db = require('../database/db');

// Crea el pedido y sus items en una sola transacción
exports.createOrder = async (userId, subtotal, shipping, total, items) => {

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [orderResult] = await connection.query(
            `INSERT INTO orders (user_id, subtotal, shipping, total)
             VALUES (?, ?, ?, ?)`,
            [userId, subtotal, shipping, total]
        );

        const orderId = orderResult.insertId;

        for (const item of items) {
            await connection.query(
                `INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
                 VALUES (?, ?, ?, ?, ?)`,
                [orderId, item.id, item.name, item.price, item.quantity]
            );
        }

        await connection.commit();

        return { id: orderId };

    } catch (error) {
        await connection.rollback();
        throw error;

    } finally {
        connection.release();
    }
};

// Ventas del período (una fila por producto vendido)
exports.findSales = async (from, to) => {

    const sql = `
        SELECT
            o.id AS order_id,
            o.created_at,
            oi.product_name,
            oi.price,
            oi.quantity,
            (oi.price * oi.quantity) AS item_total
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        WHERE DATE(o.created_at) BETWEEN ? AND ?
        ORDER BY o.created_at DESC
    `;

    const [rows] = await db.query(sql, [from, to]);

    return rows;
};