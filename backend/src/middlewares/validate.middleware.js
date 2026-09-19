const { validationResult } = require('express-validator');

// Corta la petición con un 400 si alguna regla de validación falló
module.exports = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg,
            errors: errors.array().map(e => ({
                field: e.path,
                message: e.msg
            }))
        });
    }

    next();
};