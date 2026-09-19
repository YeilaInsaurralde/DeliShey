const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const validate = require('../middlewares/validate.middleware');
const {
    registerRules,
    loginRules,
    forgotPasswordRules,
    resetPasswordRules
} = require('../validators/user.validators');

router.post('/register', registerRules, validate, userController.register);

router.post('/login', loginRules, validate, userController.login);

router.post('/forgot-password', forgotPasswordRules, validate, userController.forgotPassword);

router.post('/reset-password/:token', resetPasswordRules, validate, userController.resetPassword);

module.exports = router;