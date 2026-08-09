const express = require('express');
const router = express.Router();

const controller = require('../controllers/product.controller');
const auth = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');

// ===============================
// RUTAS DE PRODUCTOS
// ===============================

// Traer todos los productos
// Ruta pública: cualquier usuario puede ver productos
router.get('/', controller.index);

// Filtrar productos por categoría
// IMPORTANTE: va antes de /:id
// Ruta pública: cualquier usuario puede filtrar productos
router.get('/category/:category', controller.productsByCategory);

// Traer un producto por ID
// Ruta pública: cualquier usuario puede ver el detalle
router.get('/:id', controller.show);

// Crear producto (solo admin)
router.post('/', auth, isAdmin, controller.store);

// Modificar producto (solo admin)
router.put('/:id', auth, isAdmin, controller.update);

// Eliminar producto (solo admin)
router.delete('/:id', auth, isAdmin, controller.destroy);

module.exports = router;