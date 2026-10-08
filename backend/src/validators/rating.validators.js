const { body, param } = require('express-validator');

exports.rateProductRules = [
    body('product_id')
        .isInt({ min: 1 }).withMessage('Producto inválido'),

    body('rating')
        .isInt({ min: 1, max: 5 }).withMessage('La calificación debe ser de 1 a 5'),

    body('comment')
        .optional({ checkFalsy: true })
        .isString()
        .isLength({ max: 500 }).withMessage('El comentario es demasiado largo (máximo 500 caracteres)')
];

exports.productIdRules = [
    param('productId')
        .isInt({ min: 1 }).withMessage('Producto inválido')
];