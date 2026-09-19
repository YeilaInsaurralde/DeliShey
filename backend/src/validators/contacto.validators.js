const { body } = require('express-validator');

exports.contactoRules = [
    body('nombre')
        .isString().withMessage('El nombre es obligatorio').bail()
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 100 }).withMessage('El nombre es demasiado largo'),

    body('apellido')
        .isString().withMessage('El apellido es obligatorio').bail()
        .trim()
        .notEmpty().withMessage('El apellido es obligatorio')
        .isLength({ max: 100 }).withMessage('El apellido es demasiado largo'),

    body('email')
        .trim()
        .isEmail().withMessage('El email no es válido')
        .isLength({ max: 100 }).withMessage('El email es demasiado largo'),

    body('asunto')
        .isString().withMessage('El asunto es obligatorio').bail()
        .trim()
        .notEmpty().withMessage('El asunto es obligatorio')
        .isLength({ max: 150 }).withMessage('El asunto es demasiado largo'),

    body('mensaje')
        .isString().withMessage('El mensaje es obligatorio').bail()
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('El mensaje debe tener entre 10 y 2000 caracteres')
];