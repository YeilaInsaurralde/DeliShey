const express = require('express');
const router = express.Router();

const controller = require('../controllers/rating.controller');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { rateProductRules, productIdRules } = require('../validators/rating.validators');

// Calificar un producto comprado (cualquier usuario logueado)
router.post('/', auth, rateProductRules, validate, controller.store);

// Productos que compró el usuario, para calificar (antes que la de abajo, no hay conflicto de rutas pero por claridad)
router.get('/my-purchases', auth, controller.myPurchases);

// Calificaciones públicas de un producto (cualquiera puede verlas, sin login)
router.get('/product/:productId', productIdRules, validate, controller.showByProduct);

module.exports = router;