const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user.model');

exports.register = async (userData) => {

    const existingUser = await userModel.findByEmail(userData.email);

    if (existingUser) {
        throw new Error('El email ya existe');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    userData.password = hashedPassword;

    await userModel.createUser(userData);

    return {
        message: 'Usuario creado'
    };
};

exports.login = async (email, password) => {

    const user = await userModel.findByEmail(email);

    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    const validPassword = await bcrypt.compare(
        password,
        user.password
    );

    if (!validPassword) {
        throw new Error('Contraseña incorrecta');
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    };
};