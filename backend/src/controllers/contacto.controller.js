// controllers/contacto.controller.js

const nodemailer = require('nodemailer');

exports.enviarContacto = async (req, res) => {

  const { nombre, apellido, email, asunto, mensaje } = req.body;

  try {

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: email,
      to: process.env.EMAIL_TO,
      subject: `Consulta DeliShey: ${asunto}`,
      text: `
Nombre: ${nombre} ${apellido}
Email: ${email}

Mensaje:
${mensaje}
      `
    });

    res.status(200).json({
      ok: true,
      message: 'Mensaje enviado correctamente'
    });

  } catch (error) {

    console.error('Error al enviar email:', error);

    res.status(500).json({
      ok: false,
      message: 'Error al enviar email'
    });

  }
};