const Usuario = require('../../models/Register/Usuario')

// Middleware para verificar si el usuario es un vendedor
const verifySellerRole = async (req, res, next) => {
    try {
        const user = await Usuario.findOne({
            where: { id_usuario: req.userId },
            attributes: ['id_tipo_usuario'],
        });

        if (user.id_tipo_usuario !== 2) {
            return res.status(403).json({ error: 'No tiene permisos para realizar esta acción.' });
        }

        next(); // El usuario es vendedor, pasamos al siguiente middleware o controlador
    } catch (error) {
        console.error('Error al verificar el tipo de usuario:', error);
        return res.status(500).json({ error: 'Error al verificar el tipo de usuario.' });
    }
};

module.exports = verifySellerRole;
