// controllers/TipoUsuarioController.js

const TipoUsuario = require('../../models/Register/TipoUsuario');

exports.getTiposUsuario = async (req, res) => {
    try {
        // Extraer todos los tipos de usuario de la base de datos
        const tiposUsuario = await TipoUsuario.findAll({
            attributes: ['id_tipo_usuario', 'tipo'], // Selecciona solo los campos necesarios
        });

        // Enviar la lista de tipos de usuario al frontend
        res.status(200).json(tiposUsuario);
    } catch (error) {
        console.error('Error al obtener los tipos de usuario:', error.message);
        res.status(500).json({ error: 'Error al obtener los tipos de usuario.' });
    }
};
