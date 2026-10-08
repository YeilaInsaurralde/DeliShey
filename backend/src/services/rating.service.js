const ratingModel = require('../models/rating.model');
const HttpError = require('../utils/httpError');

// Crea o actualiza la calificación de un usuario para un producto,
// pero solo si lo compró
exports.rateProduct = async (userId, productId, rating, comment) => {

    const bought = await ratingModel.userBoughtProduct(userId, productId);

    if (!bought) {
        throw new HttpError(403, 'Solo podés calificar productos que hayas comprado');
    }

    await ratingModel.upsert(userId, productId, rating, comment);

};

// Calificación pública de un producto: promedio, cantidad y reseñas con comentario
exports.getProductRatings = async (productId) => {

    const summary = await ratingModel.getProductSummary(productId);
    const reviews = await ratingModel.getProductReviews(productId);

    return {
        avg_rating: summary.avg_rating ? Number(summary.avg_rating) : null,
        total_ratings: summary.total_ratings,
        reviews
    };

};

// Productos comprados por el usuario logueado, para que pueda calificarlos
exports.getMyPurchases = async (userId) => {

    return await ratingModel.getUserPurchasedProducts(userId);

};
