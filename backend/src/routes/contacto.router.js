// routes/contacto.router.js

const express = require('express');
const router = express.Router();

const contactoController = require('../controllers/contacto.controller');

router.post('/', contactoController.enviarContacto);

module.exports = router;