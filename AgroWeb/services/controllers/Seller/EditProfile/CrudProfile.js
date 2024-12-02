const Usuario = require('../../../models/Register/Usuario');
const Direccion = require('../../../models/Login/Direccion');
const TipoUsuario = require('../../../models/Register/TipoUsuario');
const DatosDNI = require('../../../models/Register/DatosDNI');
const Empresa = require('../../../models/Register/Empresa');
const jwt = require('jsonwebtoken');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

exports.getProfile = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(400).json({ error: 'Token de acceso requerido.' });
    }

    const token = authHeader.split(' ')[1];
    let id;

    try {
        const decoded = jwt.verify(token, accessTokenSecret);
        id = decoded.id;
    } catch (err) {
        return res.status(403).json({ error: 'Token inválido o ha expirado.' });
    }

    try {
        const user = await Usuario.findOne({
            where: { id_usuario: id },
            attributes: ['dni_ruc', 'correo', 'telefono', 'id_tipo_usuario', 'foto_perfil'],
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Obtener información adicional según si es DNI o RUC
        let additionalInfo = null;
        if (user.dni_ruc.length === 8) {
            additionalInfo = await DatosDNI.findOne({
                where: { dni: user.dni_ruc },
                attributes: ['primer_nombre', 'segundo_nombre', 'apellido_paterno', 'apellido_materno'],
            });
        } else if (user.dni_ruc.length === 11) {
            additionalInfo = await Empresa.findOne({
                where: { ruc: user.dni_ruc },
                attributes: ['razon_social', 'direccion', 'departamento', 'provincia', 'distrito'],
            });
        }

        const direccion = await Direccion.findOne({
            where: { id_usuario: id },
            attributes: ['pais', 'departamento', 'provincia', 'distrito', 'direccion_detallada'],
        });

        const tipoUsuario = await TipoUsuario.findOne({
            where: { id_tipo_usuario: user.id_tipo_usuario },
            attributes: ['tipo'],
        });

        return res.status(200).json({ user, direccion, tipoUsuario, additionalInfo });
    } catch (error) {
        console.error('Error al obtener el perfil:', error);
        return res.status(500).json({ error: 'Error al obtener el perfil.' });
    }
};

exports.updateProfile = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(400).json({ error: 'Token de acceso requerido.' });
    }

    const token = authHeader.split(' ')[1];
    let id;

    try {
        const decoded = jwt.verify(token, accessTokenSecret);
        id = decoded.id;
    } catch (err) {
        return res.status(403).json({ error: 'Token inválido o ha expirado.' });
    }

    const {
        correo,
        telefono,
        foto_perfil,
        pais,
        departamento,
        provincia,
        distrito,
        direccion_detallada,
        primer_nombre,
        segundo_nombre,
        apellido_paterno,
        apellido_materno,
        razon_social,
        direccion_empresa,
        departamento_empresa,
        provincia_empresa,
        distrito_empresa
    } = req.body;

    try {
        // Actualizar los datos del usuario
        const user = await Usuario.findOne({ where: { id_usuario: id } });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Actualizar los datos de Usuario (correo, teléfono, foto de perfil)
        await user.update({
            correo: correo || user.correo,
            telefono: telefono || user.telefono,
            foto_perfil: foto_perfil || user.foto_perfil
        });

        // Actualizar los datos de la dirección
        const direccion = await Direccion.findOne({ where: { id_usuario: id } });
        if (direccion) {
            await direccion.update({
                pais: pais || direccion.pais,
                departamento: departamento || direccion.departamento,
                provincia: provincia || direccion.provincia,
                distrito: distrito || direccion.distrito,
                direccion_detallada: direccion_detallada || direccion.direccion_detallada
            });
        }

        // Si el usuario tiene DNI (8 caracteres), actualizar DatosDNI
        if (user.dni_ruc.length === 8) {
            const datosDNI = await DatosDNI.findOne({ where: { dni: user.dni_ruc } });
            if (datosDNI) {
                await datosDNI.update({
                    primer_nombre: primer_nombre || datosDNI.primer_nombre,
                    segundo_nombre: segundo_nombre || datosDNI.segundo_nombre,
                    apellido_paterno: apellido_paterno || datosDNI.apellido_paterno,
                    apellido_materno: apellido_materno || datosDNI.apellido_materno
                });
            }
        }

        // Si el usuario tiene RUC (11 caracteres), actualizar Empresa
        if (user.dni_ruc.length === 11) {
            const empresa = await Empresa.findOne({ where: { ruc: user.dni_ruc } });
            if (empresa) {
                await empresa.update({
                    razon_social: razon_social || empresa.razon_social,
                    direccion: direccion_empresa || empresa.direccion,
                    departamento: departamento_empresa || empresa.departamento,
                    provincia: provincia_empresa || empresa.provincia,
                    distrito: distrito_empresa || empresa.distrito
                });
            }
        }

        return res.status(200).json({ message: 'Perfil actualizado con éxito.' });
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        return res.status(500).json({ error: 'Error al actualizar el perfil.' });
    }
};