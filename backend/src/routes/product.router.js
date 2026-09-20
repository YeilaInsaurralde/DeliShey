const express = require('express');
const router = express.Router();

const controller = require('../controllers/product.controller');
const auth = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');
const validate = require('../middlewares/validate.middleware');
const {
    productRules,
    idParamRule,
    categoryParamRule
} = require('../validators/product.validators');

// ===============================
// RUTAS DE PRODUCTOS
// ===============================

// Traer todos los productos ACTIVOS
// Ruta pública: cualquier usuario puede ver productos
router.get('/', controller.index);

// Traer TODOS los productos, activos e inactivos (solo admin)
// IMPORTANTE: va antes de /:id
router.get('/admin/all', auth, isAdmin, controller.indexAdmin);

// Filtrar productos por categoría
// IMPORTANTE: va antes de /:id
// Ruta pública: cualquier usuario puede filtrar productos
router.get('/category/:category', categoryParamRule, validate, controller.productsByCategory);

// Traer un producto por ID
// Ruta pública: cualquier usuario puede ver el detalle
router.get('/:id', idParamRule, validate, controller.show);

// Crear producto (solo admin)
router.post('/', auth, isAdmin, productRules, validate, controller.store);

// Modificar producto (solo admin)
router.put('/:id', auth, isAdmin, idParamRule, productRules, validate, controller.update);

// Eliminar producto (solo admin)
router.delete('/:id', auth, isAdmin, idParamRule, validate, controller.destroy);

module.exports = router;