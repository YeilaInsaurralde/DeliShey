const orderService = require('../services/order.service');

// Crea un pedido (cualquier usuario logueado, al finalizar la compra)
exports.store = async (req, res, next) => {
    try {
        const result = await orderService.createOrder(
            req.user.id,
            req.body
        );
        res.status(201).json(result);

    } catch (error) {
        next(error);
    }
};

// Ventas del período (solo admin)
exports.sales = async (req, res, next) => {
    try {
        const sales = await orderService.getSales(
            req.query.from,
            req.query.to
        );
        res.json(sales);

    } catch (error) {
        next(error);
    }
};

// Descarga las ventas del período como CSV (solo admin)
exports.exportCsv = async (req, res, next) => {
    try {
        const { from, to, csv } = await orderService.getSalesCsv(
            req.query.from,
            req.query.to
        );

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="ventas_${from}_a_${to}.csv"`
        );
        res.send(csv);

    } catch (error) {
        next(error);
    }
};