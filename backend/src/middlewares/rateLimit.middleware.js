const rateLimit = require('express-rate-limit');

// Crea un limitador: máximo `max` pedidos por IP cada `minutes` minutos
const createLimiter = ({ minutes, max, message, skipSuccessfulRequests = false }) =>
    rateLimit({
        windowMs: minutes * 60 * 1000,
        limit: max,
        standardHeaders: 'draft-7',
        legacyHeaders: false,
        skipSuccessfulRequests,
        // el frontend muestra err.error.message
        message: { message }
    });

// Login: solo cuentan los intentos fallidos
exports.loginLimiter = createLimiter({
    minutes: 15,
    max: 10,
    skipSuccessfulRequests: true,
    message: 'Demasiados intentos de inicio de sesión. Probá de nuevo en 15 minutos.'
});

exports.registerLimiter = createLimiter({
    minutes: 60,
    max: 10,
    message: 'Demasiados registros desde esta conexión. Probá de nuevo más tarde.'
});

// Cada pedido puede mandar un mail, por eso el límite es bajo
exports.forgotPasswordLimiter = createLimiter({
    minutes: 60,
    max: 5,
    message: 'Demasiados pedidos de recuperación. Probá de nuevo en una hora.'
});

exports.resetPasswordLimiter = createLimiter({
    minutes: 15,
    max: 10,
    message: 'Demasiados intentos. Probá de nuevo en 15 minutos.'
});

exports.contactoLimiter = createLimiter({
    minutes: 60,
    max: 5,
    message: 'Enviaste muchos mensajes. Probá de nuevo más tarde.'
});