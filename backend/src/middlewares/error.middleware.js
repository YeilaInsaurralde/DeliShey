module.exports = (err, req, res, next) => {

    // Si la respuesta ya empezó a enviarse, se la deja a Express
    if (res.headersSent) {
        return next(err);
    }
    // Body que no es un JSON válido
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            message: 'El cuerpo de la petición no es un JSON válido'
        });
    }
    // Registro duplicado en MySQL (por ejemplo dos registros a la vez con el mismo email)
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            message: 'Ya existe un registro con esos datos'
        });
    }
    const status = err.status || 500;
    // Errores del servidor: el detalle queda solo en la terminal, no se le muestra al usuario
    if (status >= 500) {
        console.error(err);
        return res.status(500).json({
            message: 'Error interno del servidor'
        });
    }
    // Errores esperados (401, 404, 409, etc.): se muestra su mensaje
    res.status(status).json({
        message: err.message
    });

};