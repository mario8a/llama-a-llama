const axios = require('axios');

async function sendMessage() {
  const accessToken = 'EAAO69vfcNYsBOw8ZAo4PnAyP3uxjT5P8YpzEqkNxOXxF7nWCoWdF0RRH15mDoACZAfHlBMuFJwOc0pq7cNWZCLn4FlwzJhCgumDT1SVK1KqYPvXsnHAVFLdNZBJ5XwBpDhKG09thgfykNZAjKIea2p3bMDqpOaAfXEFzZCjcHTB7rE4XAZAEISicsQAkB8zR16QcR58Y5pZCWbi11ZBZA4iePV2bZCON5Dx3329GNyVOWEVy3gZD'; // Reemplaza con tu token de acceso
  const recipientPhoneNumber = '525583266381'; // Reemplaza con el número de teléfono de destino (en formato internacional)
  const whatsappAPIUrl = 'https://graph.facebook.com/v20.0/386007741272228/messages';

  const messageData = {
    messaging_product: 'whatsapp',
    to: recipientPhoneNumber,
    type: 'template',
    template: {
      name: 'hello_world', // Reemplaza con el nombre correcto de tu template
      language: {
        code: 'en_US'  // El idioma del template debe estar configurado correctamente
      }
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

sendMessage();
