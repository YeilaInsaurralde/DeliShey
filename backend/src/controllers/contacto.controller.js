
exports.enviarContacto = async (req, res) => {
    const { nombre, apellido, email, asunto, mensaje } = req.body;

    try {
        const apiKey = process.env.BREVO_API_KEY;
        const senderEmail = process.env.BREVO_SENDER_EMAIL;
        const senderName = process.env.BREVO_SENDER_NAME || 'DeliShey';
        const recipientEmail = process.env.EMAIL_TO;

        if (!apiKey || !senderEmail || !recipientEmail) {
            throw new Error('Falta configurar el correo en Brevo');
        }

        const response = await fetch(
            'https://api.brevo.com/v3/smtp/email',
            {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': apiKey,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    sender: {
                        name: senderName,
                        email: senderEmail
                    },
                    to: [
                        { email: recipientEmail }
                    ],
                    replyTo: {
                        email: email
                    },
                    subject: `Consulta DeliShey: ${asunto}`,
                    textContent: `
Nombre: ${nombre} ${apellido}
Email: ${email}

Mensaje:
${mensaje}
                    `
                }),
                signal: AbortSignal.timeout(15000)
            }
        );

        if (!response.ok) {
            const errorBody = await response.text();

            console.error('Error de Brevo:', {
                status: response.status,
                details: errorBody
            });

            throw new Error('No se pudo enviar el correo');
        }

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
