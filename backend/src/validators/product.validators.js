const { body, param } = require('express-validator');

// Tienen que coincidir exactamente con los links del header
const CATEGORIES = ['Pastelería', 'Panadería', 'Regalos'];

exports.productRules = [
    body('name')
        .isString().withMessage('El nombre es obligatorio').bail()
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 100 }).withMessage('El nombre es demasiado largo'),

    // la columna es DECIMAL(10,2): máximo 99.999.999,99
    body('price')
        .isFloat({ gt: 0, lt: 100000000 })
        .withMessage('El precio debe ser un número mayor a 0'),

    body('category')
        .isIn(CATEGORIES)
        .withMessage(`La categoría debe ser: ${CATEGORIES.join(', ')}`),

    body('description')
        .optional({ values: 'falsy' })
        .isString().withMessage('La descripción no es válida').bail()
        .isLength({ max: 2000 }).withMessage('La descripción es demasiado larga'),

    // ruta local (/assets/...) o URL http(s)
    body('image')
        .optional({ values: 'falsy' })
        .isString().withMessage('La imagen no es válida').bail()
        .matches(/^(\/|https?:\/\/)/)
        .withMessage('La imagen debe ser una ruta (/assets/...) o una URL http(s)')
        .isLength({ max: 500 }).withMessage('La ruta de la imagen es demasiado larga')
];

exports.idParamRule = [
    param('id').isInt({ min: 1 }).withMessage('ID inválido')
];

exports.categoryParamRule = [
    param('category')
        .trim()
        .notEmpty()
        .isLength({ max: 100 })
        .withMessage('Categoría inválida')
];