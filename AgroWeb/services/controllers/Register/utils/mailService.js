// services/mailService.js

const transporter = require('../../../../config/mailer');

const sendVerificationEmail = async (to, code) => {
    const mailOptions = {
        from: `"AgroWeb Support" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Código de Verificación - AgroWeb',
        text: `Tu código de verificación es: ${code}`,
        html: `<p>Tu código de verificación es: <strong>${code}</strong></p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${to}`);
    } catch (error) {
        console.error(`Error sending verification email to ${to}:`, error);
        throw new Error('Error al enviar el correo de verificación');
    }
};

// Nueva función para enviar correo al vendedor con información del comprador
const sendBuyerContactEmail = async (sellerEmail, buyerEmail, productName, productDescription) => {
    const mailOptions = {
        from: `"AgroWeb Support" <${process.env.EMAIL_USER}>`,
        to: sellerEmail,
        subject: 'Un comprador está interesado en su producto',
        text: `Un comprador está interesado en su producto "${productName}". Puede contactarlo a través del correo: ${buyerEmail}.
        
Detalles del producto:
Nombre: ${productName}
Descripción: ${productDescription}
        `,
        html: `<p>Un comprador está interesado en su producto "<strong>${productName}</strong>". Puede contactarlo a través del correo: <a href="mailto:${buyerEmail}">${buyerEmail}</a>.</p>
               <p><strong>Detalles del producto:</strong></p>
               <p><strong>Nombre:</strong> ${productName}</p>
               <p><strong>Descripción:</strong> ${productDescription}</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo de contacto enviado al vendedor: ${sellerEmail}`);
    } catch (error) {
        console.error(`Error al enviar el correo al vendedor:`, error);
        throw new Error('Error al enviar el correo al vendedor');
    }
};

module.exports = {
    sendVerificationEmail,
    sendBuyerContactEmail, // Exportamos la nueva función
};
