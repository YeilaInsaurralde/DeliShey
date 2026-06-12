const express = require('express');
const router = express.Router();

const controller = require('../controllers/product.controller');

// ===============================
// RUTAS DE PRODUCTOS
// ===============================

// Traer todos los productos
router.get('/', controller.index);

// Filtrar productos por categoría
// IMPORTANTE: va antes de /:id
router.get('/category/:category', controller.productsByCategory);

// Traer un producto por ID
router.get('/:id', controller.show);

// Crear producto
router.post('/', controller.store);

// Modificar producto
router.put('/:id', controller.update);

// Eliminar producto
router.delete('/:id', controller.destroy);

module.exports = router;