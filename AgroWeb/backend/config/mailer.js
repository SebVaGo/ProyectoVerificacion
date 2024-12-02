const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Usando variables de entorno para mayor seguridad
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error al configurar nodemailer:', error);
    } else {
        console.log('El servidor de correo está listo para enviar mensajes');
    }
});

module.exports = transporter;
