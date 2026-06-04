const userService = require('../services/user.service');


exports.register = async (req, res, next) => {
    try {
        const result = await userService.register(req.body);
        res.status(201).json(result);

    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {

        const result = await userService.login(
            req.body.email,
            req.body.password
        );

        res.json(result);

    } catch (error) {
        next(error);
    }
};

exports.forgotPassword =
async (req, res, next) => {

    try {

        const result =
            await userService
            .forgotPassword(
                req.body.email
            );

        res.json(result);

    } catch (error) {
        next(error);
    }
};

exports.resetPassword =
async (req, res, next) => {
    try {
        const result =
            await userService
            .resetPassword(
                req.params.token,
                req.body.password
            );

        res.json(result);

    } catch (error) {

        next(error);

    }
};


