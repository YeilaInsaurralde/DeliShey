const express = require('express');
const router = express.Router();

const controller = require('../controllers/order.controller');
const auth = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');
const validate = require('../middlewares/validate.middleware');
const { createOrderRules, dateRangeRules } = require('../validators/order.validators');

// Crear un pedido (cualquier usuario logueado)
router.post('/', auth, createOrderRules, validate, controller.store);

// Ventas del período (solo admin)
router.get('/admin/sales', auth, isAdmin, dateRangeRules, validate, controller.sales);

// Descargar las ventas como CSV (solo admin)
router.get('/admin/export', auth, isAdmin, dateRangeRules, validate, controller.exportCsv);

module.exports = router;