const DatosDNI = require('../../models/Register/DatosDNI');
const Empresa = require('../../models/Register/Empresa');
const VerificacionDNI = require('../../models/Register/VerificarDNI');
const VerificacionRUC = require('../../models/Register/VerificarRUC');
const Usuario = require('../../models/Register/Usuario');
const generateVerificationCode = require('./utils/generateCode');
const { sendVerificationEmail } = require('./utils/mailService');

exports.enviarCodigoVerificacion = async (req, res) => {
    console.log('Enviando código de verificación...');
    const { correo, dni_ruc, tipo_usuario } = req.body;

    // Validación de los datos recibidos
    if (!correo || !dni_ruc || !tipo_usuario) {
        return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    } else if (tipo_usuario !== '1' && tipo_usuario !== '2') {
        return res.status(400).json({ error: 'Tipo de usuario inválido.' });
    }

    try {
        // Verificar si el correo ya está asociado con otro DNI/RUC distinto
        const existingUserWithEmail = await Usuario.findOne({ where: { correo } });

        if (existingUserWithEmail && existingUserWithEmail.dni_ruc !== dni_ruc) {
            return res.status(400).json({ error: 'El correo ya está en uso con otro DNI/RUC.' });
        }

        let entity, VerificacionModel, foreignKeyColumn;
        if (dni_ruc.length === 8) {
            entity = await DatosDNI.findOne({ where: { dni: dni_ruc } });
            VerificacionModel = VerificacionDNI;
            foreignKeyColumn = 'id_datos_dni';
        } else if (dni_ruc.length === 11) {
            entity = await Empresa.findOne({ where: { ruc: dni_ruc } });
            VerificacionModel = VerificacionRUC;
            foreignKeyColumn = 'id_empresa';
        }

        if (!entity) {
            return res.status(404).json({ error: 'Entidad no encontrada.' });
        }

        const codigo = generateVerificationCode();
        const fechaExpiracion = new Date(Date.now() + 5 * 60 * 1000); // Expira en 5 minutos

        await VerificacionModel.create({
            [foreignKeyColumn]: entity[foreignKeyColumn],
            codigo,
            tipo_codigo: 'Registro',
            fecha_expiracion: fechaExpiracion,
        });

        await sendVerificationEmail(correo, codigo);

        res.status(200).json({ message: 'Código de verificación enviado al correo electrónico.' });
    } catch (error) {
        console.error('Error al enviar el código de verificación:', error.message);
        res.status(500).json({ error: 'Error al enviar el código de verificación.' });
    }
};


exports.verificarCodigo = async (req, res) => {
    const { codigo, dni_ruc } = req.body;

    try {
        let entity, VerificacionModel, foreignKeyColumn, idField;
        if (dni_ruc.length === 8) {
            entity = await DatosDNI.findOne({ where: { dni: dni_ruc } });
            VerificacionModel = VerificacionDNI;
            foreignKeyColumn = 'id_datos_dni';
            idField = 'id_verificacion_dni';
        } else if (dni_ruc.length === 11) {
            entity = await Empresa.findOne({ where: { ruc: dni_ruc } });
            VerificacionModel = VerificacionRUC;
            foreignKeyColumn = 'id_empresa';
            idField = 'id_verificacion_ruc';
        }

        if (!entity) {
            return res.status(404).json({ error: 'Entidad no encontrada.' });
        }

        // Buscar el código de verificación en la base de datos
        const verificacion = await VerificacionModel.findOne({
            where: {
                [foreignKeyColumn]: entity[foreignKeyColumn],
                codigo,
                tipo_codigo: 'Registro',
            },
        });

        if (!verificacion) {
            return res.status(400).json({ error: 'Código de verificación incorrecto.' });
        }

        // Verificar si el código ha expirado
        if (new Date() > verificacion.fecha_expiracion) {
            await VerificacionModel.destroy({ where: { [idField]: verificacion[idField] } });
            return res.status(400).json({ error: 'El código de verificación ha expirado.' });
        }

        // Eliminar el código después de verificarlo correctamente
        await VerificacionModel.destroy({ where: { [idField]: verificacion[idField] } });

        res.status(200).json({ message: 'Código verificado exitosamente.' });
    } catch (error) {
        console.error('Error al verificar el código:', error.message);
        res.status(500).json({ error: 'Error al verificar el código.' });
    }
};
