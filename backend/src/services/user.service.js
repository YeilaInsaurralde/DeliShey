const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userModel = require('../models/user.model');
const mailService = require('./mail.service');

// Hashea el token antes de guardarlo o buscarlo en la base
const hashToken = (token) =>
    crypto.createHash('sha256').update(token).digest('hex');

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
        throw new Error('Credenciales inválidas');
    }
    const validPassword = await bcrypt.compare(
        password,
        user.password
    );
    if (!validPassword) {
        throw new Error('Credenciales inválidas');
    }
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role_id: user.role_id
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
            email: user.email,
            role_id: user.role_id
        }
    };
};

exports.forgotPassword = async (email) => {

    const genericResponse = {
        message: 'Si el email está registrado, te enviamos un link para restablecer tu contraseña. Revisá también la carpeta de spam. Si no te llega, verificá que sea el mismo email con el que te registraste.'
    };

    const user = await userModel.findByEmail(email);

    if (!user) {
        return genericResponse;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 3600000);

    // En la base se guarda el hash, nunca el token real
    await userModel.saveResetToken(email, hashToken(token), expiration);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await mailService.sendResetPasswordEmail(email, resetLink);

    return genericResponse;
};

exports.resetPassword = async (token, password) => {
    const user = await userModel.findByResetToken(hashToken(token));
    if (!user) {
        throw new Error('Token inválido');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.updatePassword(user.id, hashedPassword);
    return {
        message: 'Contraseña actualizada'
    };
};