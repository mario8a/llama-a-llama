const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Token de acceso de tu cuenta de WhatsApp Business
const accessToken = 'EAAO69vfcNYsBO9lA1Lqzupg0bMjXDpmzHaekqaBPwK4w6AZC5TZAQIcym3ZBZAl3KyBCACdSvHzZBMZCYqXtrhAZBxqO4Bo2FxkjtScZC845ZA7ZBEEhdIAyyN4eHJM3ifZAuSukQeXgCwZA58XemZCh0mFZBswb0iWz2LbPtJ3Q0z8egaB1sBCiKS9XPNZBPFd5v9pY64yxmReZBWJ1yH7LPyaoZBmq6GNFmwPrW7kBbfozasZCLZCkyUZD';  // Reemplaza con tu token

const whatsappAPIUrl = 'https://graph.facebook.com/v20.0/386007741272228/messages'; // Cambia el número de tu cuenta de WhatsApp

app.use(bodyParser.json());

// Ruta para la verificación del webhook
app.get('/webhook', (req, res) => {
    const verifyToken = 'YOUR_VERIFY_TOKEN';  // Reemplaza con tu token de verificación

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === verifyToken) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// Ruta para recibir mensajes entrantes
app.post('/webhook', async (req, res) => {
    const body = req.body;

    if (body.object) {
        if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
            const messageData = body.entry[0].changes[0].value.messages[0];

            const phoneNumber = messageData.from; // Número del remitente
            const text = messageData.text.body;  // Mensaje recibido

            console.log(`Mensaje recibido de ${phoneNumber}: ${text}`);

            // Envía una respuesta automática
            await sendMessage(phoneNumber, `¡Hola! Has enviado: "${text}".`);

            res.status(200).send('EVENT_RECEIVED');
        } else {
            res.status(404).send('No new messages');
        }
    } else {
        res.sendStatus(404);
    }
});

// Función para enviar mensajes a través de la API de WhatsApp
async function sendMessage(recipientPhoneNumber, messageText) {
    const messageData = {
        messaging_product: 'whatsapp',
        to: recipientPhoneNumber,
        type: 'text',
        text: {
            body: messageText
        }
    };

    try {
        const response = await axios.post(whatsappAPIUrl, messageData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('Mensaje enviado con éxito:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Error al enviar el mensaje:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
