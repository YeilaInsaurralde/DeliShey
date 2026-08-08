// Debe usarse siempre despues de auth.middleware,
// ya que depende de req.user seteado por ese middleware.

module.exports = (req, res, next) => {

    if (!req.user || req.user.role_id !== 1) {
        return res.status(403).json({
            message: 'Acceso restringido a administradores'
        });
    }

    next();

};
