const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const validate = require('../middlewares/validate.middleware');
const {
    loginLimiter,
    registerLimiter,
    forgotPasswordLimiter,
    resetPasswordLimiter
} = require('../middlewares/rateLimit.middleware');
const {
    registerRules,
    loginRules,
    forgotPasswordRules,
    resetPasswordRules
} = require('../validators/user.validators');

router.post('/register', registerLimiter, registerRules, validate, userController.register);

router.post('/login', loginLimiter, loginRules, validate, userController.login);

router.post('/forgot-password', forgotPasswordLimiter, forgotPasswordRules, validate, userController.forgotPassword);

router.post('/reset-password/:token', resetPasswordLimiter, resetPasswordRules, validate, userController.resetPassword);

module.exports = router;