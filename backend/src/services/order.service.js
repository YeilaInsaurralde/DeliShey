const orderModel = require('../models/order.model');
const productModel = require('../models/product.model');
const HttpError = require('../utils/httpError');

// Arma el pedido recalculando los precios en el servidor,
// nunca confiando en los precios que manda el navegador
exports.createOrder = async (userId, data) => {

    const items = [];
    let subtotal = 0;

    for (const line of data.items) {

        const product = await productModel.findById(line.productId);

        if (!product || !product.is_active) {
            throw new HttpError(400, `Producto no disponible: ${line.productId}`);
        }

        const price = Number(product.price);
        const quantity = line.quantity;

        subtotal += price * quantity;

        items.push({
            id: product.id,
            name: product.name,
            price,
            quantity
        });
    }

    const shipping = Number(data.shipping) || 0;
    const total = subtotal + shipping;

    const order = await orderModel.createOrder(
        userId,
        subtotal,
        shipping,
        total,
        items
    );

    return {
        message: 'Pedido registrado',
        orderId: order.id
    };
};

exports.getSales = async (from, to) => {
    const { fromDate, toDate } = resolveDates(from, to);
    return await orderModel.findSales(fromDate, toDate);
};

exports.getSalesCsv = async (from, to) => {

    const { fromDate, toDate } = resolveDates(from, to);
    const rows = await orderModel.findSales(fromDate, toDate);

    const header = 'Fecha,Producto,Cantidad,Precio,Total\n';

    const body = rows.map(r => {
        const fecha = new Date(r.created_at).toLocaleString('es-AR');
        const producto = `"${r.product_name.replace(/"/g, '""')}"`;
        return `${fecha},${producto},${r.quantity},${r.price},${r.item_total}`;
    }).join('\n');

    return {
        from: fromDate,
        to: toDate,
        csv: header + body
    };
};

// Si no mandan fechas, usa el día de hoy
function resolveDates(from, to) {
    const today = new Date().toISOString().slice(0, 10);
    return {
        fromDate: from || today,
        toDate: to || today
    };
}