const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 1000; // Cambia esto si usas un puerto diferente

// Middleware para analizar el cuerpo de la solicitud
app.use(express.json());

// Token de acceso de WhatsApp
const accessToken = 'EAAO69vfcNYsBOw8ZAo4PnAyP3uxjT5P8YpzEqkNxOXxF7nWCoWdF0RRH15mDoACZAfHlBMuFJwOc0pq7cNWZCLn4FlwzJhCgumDT1SVK1KqYPvXsnHAVFLdNZBJ5XwBpDhKG09thgfykNZAjKIea2p3bMDqpOaAfXEFzZCjcHTB7rE4XAZAEISicsQAkB8zR16QcR58Y5pZCWbi11ZBZA4iePV2bZCON5Dx3329GNyVOWEVy3gZD'; // Reemplaza con tu token de acceso
const phoneNumberId = '386007741272228'; // Reemplaza con el verdadero ID del número de teléfono
const whatsappAPIUrl = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

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

        // Imprime el número de quien envía el mensaje y el contenido
        console.log(`Número del remitente: ${from}`);
        console.log(`Mensaje recibido: ${message}`);

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
    // Eliminar el '1' extra después del código de país '52' si está presente
    const cleanedPhoneNumber = recipientPhoneNumber.replace(/^(52)1(\d{10})$/, '$1$2');

    console.log(`Número procesado: ${cleanedPhoneNumber}`); // Para verificar el número procesado

    const messageData = {
        messaging_product: 'whatsapp',
        to: cleanedPhoneNumber,
        type: 'text',
        text: {
            body: `Has enviado: ${receivedMessage}. ¡Gracias por tu mensaje!` // Mensaje de respuesta
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
