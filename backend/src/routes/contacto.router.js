const express = require('express');
const router = express.Router();

const contactoController = require('../controllers/contacto.controller');
const validate = require('../middlewares/validate.middleware');
const { contactoRules } = require('../validators/contacto.validators');

router.post('/', contactoRules, validate, contactoController.enviarContacto);

module.exports = router;