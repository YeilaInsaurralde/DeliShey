const { body, param } = require('express-validator');

const emailRule = body('email')
    .trim()
    .isEmail().withMessage('El email no es válido')
    .isLength({ max: 100 }).withMessage('El email es demasiado largo');

// bcrypt solo usa los primeros 72 caracteres, por eso ese máximo
const passwordRule = body('password')
    .isString().withMessage('La contraseña es obligatoria').bail()
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .isLength({ max: 72 }).withMessage('La contraseña no puede superar los 72 caracteres');

exports.registerRules = [
    body('name')
        .isString().withMessage('El nombre es obligatorio').bail()
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 100 }).withMessage('El nombre es demasiado largo'),
    emailRule,
    passwordRule
];

// En el login NO se exige el largo mínimo, para no bloquear a usuarios viejos
exports.loginRules = [
    body('email').trim().notEmpty().withMessage('Ingresá tu email y contraseña'),
    body('password').notEmpty().withMessage('Ingresá tu email y contraseña')
];

exports.forgotPasswordRules = [
    emailRule
];

exports.resetPasswordRules = [
    // el token que genera el backend son 64 caracteres hexadecimales
    param('token')
        .isHexadecimal().isLength({ min: 64, max: 64 })
        .withMessage('Token inválido'),
    passwordRule
];