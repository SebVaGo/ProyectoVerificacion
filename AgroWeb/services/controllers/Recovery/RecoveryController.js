const Usuario = require('../../models/Register/Usuario');
const Verificacion = require('../../models/Register/Verificacion');
const generateVerificationCode = require('../Register/utils/generateCode');
const { sendVerificationEmail } = require('../Register/utils/mailService');
const bcrypt = require('bcryptjs');

exports.solicitarRecuperacion = async (req, res) => {
    const { correo } = req.body;

    try {
        const user = await Usuario.findOne({ where: { correo } });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        const codigo = generateVerificationCode();
        const fechaExpiracion = new Date(Date.now() + 5 * 60 * 1000); // Código expira en 5 minutos

        await Verificacion.create({
            id_usuario: user.id_usuario,
            codigo,
            tipo_codigo: 'Recuperacion',
            fecha_creacion: fechaExpiracion,
            utilizado: false
        });

        await sendVerificationEmail(correo, codigo);

        return res.status(200).json({ message: 'Código de verificación enviado al correo electrónico.' });
    } catch (error) {
        console.error('Error al solicitar la recuperación:', error.message);
        return res.status(500).json({ error: 'Error al solicitar la recuperación.' });
    }
};

exports.verificarCodigoRecuperacion = async (req, res) => {
    const { correo, codigo } = req.body;

    try {
        const user = await Usuario.findOne({ where: { correo } });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        const verificacion = await Verificacion.findOne({
            where: {
                id_usuario: user.id_usuario,
                codigo,
                tipo_codigo: 'Recuperacion',
                utilizado: false
            }
        });

        if (!verificacion) {
            return res.status(400).json({ error: 'Código de verificación incorrecto o ya utilizado.' });
        }

        if (new Date() > verificacion.fecha_creacion) {
            return res.status(400).json({ error: 'El código de verificación ha expirado.' });
        }

        await verificacion.update({ utilizado: true });

        return res.status(200).json({ message: 'Código verificado exitosamente. Procede a cambiar la contraseña.' });
    } catch (error) {
        console.error('Error al verificar el código:', error.message);
        return res.status(500).json({ error: 'Error al verificar el código.' });
    }
};

exports.actualizarClave = async (req, res) => {
    const { correo, nuevaClave } = req.body;

    try {
        const user = await Usuario.findOne({ where: { correo } });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(nuevaClave, salt);

        await user.update({ clave: hashedPassword });

        return res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error.message);
        return res.status(500).json({ error: 'Error al actualizar la contraseña.' });
    }
};

