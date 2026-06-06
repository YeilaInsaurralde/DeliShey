const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userModel = require('../models/user.model');

//logica de usuario, autenticado, registrado, recupera password

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


exports.forgotPassword = async (
    email
) => {

    const user =
        await userModel.findByEmail(email);

    if (!user) {
        throw new Error(
            'Usuario no encontrado'
        );
    }
    const token =
        crypto.randomBytes(32)
        .toString('hex');
    const expiration =
        new Date(
            Date.now() + 3600000
        );
    await userModel.saveResetToken(
        email,
        token,
        expiration
    );
    return {
        token
    };
};

exports.resetPassword = async (
    token,
    password
) => {
    const user =
        await userModel.findByResetToken(
            token
        );
    if (!user) {
        throw new Error(
            'Token inválido'
        );
    }
    const hashedPassword =
        await bcrypt.hash(
            password,
            10
        );
    await userModel.updatePassword(
        user.id,
        hashedPassword
    );
    return {
        message:
        'Contraseña actualizada'
    };
};



