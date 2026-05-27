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