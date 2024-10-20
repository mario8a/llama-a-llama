const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 1000; // Cambia esto si usas un puerto diferente

// Middleware para analizar el cuerpo de la solicitud
app.use(express.json());

// Token de acceso de WhatsApp
const accessToken = 'EAAO69vfcNYsBO9lA1Lqzupg0bMjXDpmzHaekqaBPwK4w6AZC5TZAQIcym3ZBZAl3KyBCACdSvHzZBMZCYqXtrhAZBxqO4Bo2FxkjtScZC845ZA7ZBEEhdIAyyN4eHJM3ifZAuSukQeXgCwZA58XemZCh0mFZBswb0iWz2LbPtJ3Q0z8egaB1sBCiKS9XPNZBPFd5v9pY64yxmReZBWJ1yH7LPyaoZBmq6GNFmwPrW7kBbfozasZCLZCkyUZD'; // Reemplaza con tu token de acceso
const whatsappAPIUrl = 'https://graph.facebook.com/v20.0/386007741272228/messages';

// Ruta de verificación del webhook (GET)
app.get('/webhook', (req, res) => {
    const verifyToken = '2ngtMXSDkqqGWJdh9kcDSLLLqpI_6995hTkRigMgAVVs3czvQ';

    // Verifica el token de verificación
    if (req.query['hub.mode'] && req.query['hub.verify_token']) {
        if (req.query['hub.verify_token'] === verifyToken) {
            console.log('Webhook verificado');
            return res.status(200).send(req.query['hub.challenge']);
        } else {
            return res.sendStatus(403); // Forbidden
        }
    }
    res.sendStatus(404); // Not Found
});

// Ruta para recibir mensajes (POST)
app.post('/webhook', (req, res) => {
    const body = req.body;

    // Verifica si el cuerpo tiene el objeto
    if (body.object) {
        console.log('Mensaje recibido:', body);

        // Procesar el mensaje recibido
        const from = body.entry[0].changes[0].value.messages[0].from; // Número de quien envía
        const message = body.entry[0].changes[0].value.messages[0].text.body; // Texto del mensaje recibido

        // Responde al mensaje recibido
        respondToMessage(from, message);

        // Responde con un 200 OK
        return res.sendStatus(200); // OK
    } else {
        return res.sendStatus(404); // Not Found
    }
});

// Función para enviar un mensaje
async function respondToMessage(recipientPhoneNumber, receivedMessage) {
    const messageData = {
        messaging_product: 'whatsapp',
        to: recipientPhoneNumber,
        type: 'text', // Cambia a 'template' si usas plantillas
        text: {
            body: `Has enviado: ${receivedMessage}. Gracias por tu mensaje!` // Mensaje de respuesta
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

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
