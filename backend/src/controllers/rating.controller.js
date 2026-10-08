const ratingService = require('../services/rating.service');

// Calificar (o actualizar la calificación de) un producto comprado
exports.store = async (req, res, next) => {
    try {
        await ratingService.rateProduct(
            req.user.id,
            req.body.product_id,
            req.body.rating,
            req.body.comment
        );

        res.status(201).json({ message: 'Calificación guardada' });

    } catch (error) {
        next(error);
    }
};

// Calificaciones públicas de un producto (promedio + reseñas)
exports.showByProduct = async (req, res, next) => {
    try {
        const data = await ratingService.getProductRatings(req.params.productId);
        res.json(data);

    } catch (error) {
        next(error);
    }
};

// Productos que compró el usuario logueado, para calificar
exports.myPurchases = async (req, res, next) => {
    try {
        const products = await ratingService.getMyPurchases(req.user.id);
        res.json(products);

    } catch (error) {
        next(error);
    }
};