const { body, query } = require('express-validator');

exports.createOrderRules = [
    body('items')
        .isArray({ min: 1 }).withMessage('El pedido no puede estar vacío'),

    body('items.*.productId')
        .isInt({ min: 1 }).withMessage('Producto inválido'),

    body('items.*.quantity')
        .isInt({ min: 1, max: 100 }).withMessage('Cantidad inválida'),

    body('shipping')
        .isFloat({ min: 0 }).withMessage('Envío inválido')
];

exports.dateRangeRules = [
    query('from')
        .optional()
        .isDate().withMessage('Fecha "desde" inválida'),

    query('to')
        .optional()
        .isDate().withMessage('Fecha "hasta" inválida')
];