const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../../models/Register/Usuario');
const Direccion = require('../../models/Login/Direccion');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

exports.login = async (req, res) => {
    const { correo, clave } = req.body;

    try {
        // Buscar todos los perfiles del usuario por correo
        const usuarios = await Usuario.findAll({ where: { correo } });

        // Si no se encuentran usuarios con ese correo
        if (usuarios.length === 0) {
            return res.status(401).json({ error: 'El correo ingresado no está registrado.' });
        }

        // Verificar la contraseña solo con el primer usuario encontrado
        const isPasswordValid = await bcrypt.compare(clave, usuarios[0].clave);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'La contraseña es incorrecta. Inténtelo de nuevo.' });
        }

        // Si el usuario tiene más de un perfil (por ejemplo, comprador y vendedor)
        if (usuarios.length > 1) {
            const perfiles = usuarios.map(user => ({
                id_usuario: user.id_usuario,  // Verifica que el id_usuario se incluya correctamente
                tipo_usuario: user.id_tipo_usuario  // El tipo de usuario (por ejemplo, COMPRADOR o VENDEDOR)
            }));

            // Retornar los perfiles para que el frontend permita la selección
            return res.status(200).json({
                message: 'Seleccione el perfil con el que desea ingresar.',
                perfiles,  // Enviamos los perfiles para que el usuario seleccione uno
                seleccionRequerida: true,  // Indicamos que el usuario necesita seleccionar un perfil
                id_usuario: usuarios[0].id_usuario // Incluye el id_usuario del primer perfil
            });
        }

        // Si el usuario tiene solo un perfil, proceder normalmente
        const user = usuarios[0];  // El primer (y único) usuario encontrado
        const accessToken = jwt.sign({ id: user.id_usuario, role: user.id_tipo_usuario }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

        // Verificar si es el primer login
        if (user.primer_login) {
            return res.status(200).json({
                message: 'Es necesario completar los datos de su perfil.',
                primerLogin: true,
                accessToken,
                id_usuario: user.id_usuario
            });
        }

        // Crear y enviar el accessToken como cookie y respuesta
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });
        console.log('Usuario autenticado:', user.id_usuario);

        return res.status(200).json({ accessToken, primerLogin: false, id_usuario: user.id_usuario });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ error: 'Error del servidor. Por favor, inténtelo más tarde.' });
    }
};


exports.loginConPerfil = async (req, res) => {
    const { id_usuario, tipo_usuario } = req.body;
    console.log('id_usuario:', id_usuario, 'tipo_usuario:', tipo_usuario);

    try {
        const user = await Usuario.findOne({ where: { id_usuario, id_tipo_usuario: tipo_usuario } });
        
        if (!user) {
            console.error('No se encontró el usuario con id_usuario:', id_usuario, 'y tipo_usuario:', tipo_usuario);
            return res.status(401).json({ error: 'Usuario o perfil no encontrado.' });
        }

        // Generar el accessToken basado en el perfil seleccionado
        const accessToken = jwt.sign({ id: user.id_usuario, role: tipo_usuario }, accessTokenSecret, { expiresIn: '15m' });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        return res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Error al seleccionar el perfil:', error);
        return res.status(500).json({ error: 'Error al seleccionar el perfil.' });
    }
};





exports.completeProfile = async (req, res) => {
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

    const { pais, departamento, provincia, distrito, direccion_detallada } = req.body;

    try {
        const user = await Usuario.findOne({ where: { id_usuario: id } });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        await Direccion.create({
            id_usuario: id,
            pais,
            departamento,
            provincia,
            distrito,
            direccion_detallada
        });

        await user.update({ primer_login: 0 });

        return res.status(200).json({ message: 'Perfil completado con éxito.' });
    } catch (error) {
        console.error('Error al completar el perfil:', error);
        return res.status(500).json({ error: 'Error al completar el perfil.' });
    }
};

exports.leftTime = (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(400).json({ error: 'Token de acceso requerido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, accessTokenSecret);
        const timeLeft = Math.floor((decoded.exp - Date.now() / 1000) / 60 * 15);

        if (timeLeft <= 0) {
            return res.status(403).json({ error: 'Token ha expirado.' });
        }

        return res.status(200).json({ timeLeft });
    } catch (err) {
        return res.status(403).json({ error: 'Token inválido o ha expirado.' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('accessToken');
    return res.status(200).json({ message: 'Sesión cerrada exitosamente.' });
};
