
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

exports.sendResetPasswordEmail = async (to, resetLink) => {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME || 'DeliShey';

    if (!apiKey || !senderEmail) {
        throw new Error('Falta configurar Brevo');
    }

    const response = await fetch(BREVO_API_URL, {
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
            to: [{ email: to }],
            subject: 'Recuperar contraseña - DeliShey',
            textContent: `Recibimos un pedido para restablecer tu contraseña.

Entrá a este enlace (vence en 1 hora):
${resetLink}

Si no fuiste vos, ignorá este correo.`
        }),
        signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
        const errorBody = await response.text();

        console.error('Error al enviar correo con Brevo:', {
            status: response.status,
            details: errorBody
        });

        throw new Error('No se pudo enviar el correo de recuperación');
    }

    console.log('Correo de recuperación aceptado por Brevo');
};
