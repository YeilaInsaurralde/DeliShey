const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendResetPasswordEmail = async (to, resetLink) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: 'Recuperar contraseña - DeliShey',
        text:
`Recibimos un pedido para restablecer tu contraseña.

Entrá a este link (vence en 1 hora):
${resetLink}

Si no fuiste vos, ignorá este mail.`
    });
};