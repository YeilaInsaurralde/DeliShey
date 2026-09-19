// Error con código HTTP: new HttpError(404, 'Producto no encontrado')
class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

module.exports = HttpError;