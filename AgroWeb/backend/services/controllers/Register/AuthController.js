const bcrypt = require('bcryptjs');
const Usuario = require('../../models/Register/Usuario');

exports.finalizarRegistro = async (req, res) => {
    const { dni_ruc, telefono, correo, clave, id_tipo_usuario } = req.body;

    console.log('Datos recibidos:', req.body);

    try {
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(clave, 10);

        // Crear el nuevo usuario (sin id_empresa ni id_datos_dni)
        const newUser = await Usuario.create({
            dni_ruc,
            telefono,
            correo,
            clave: hashedPassword,
            id_tipo_usuario,
        });

        res.status(201).json({ 
            message: 'Usuario registrado exitosamente.',
            user: {
                id_usuario: newUser.id_usuario,
                dni_ruc: newUser.dni_ruc,
                telefono: newUser.telefono,
                correo: newUser.correo,
                id_tipo_usuario: newUser.id_tipo_usuario,
                created_at: newUser.created_at
            }
        });
    } catch (error) {
        console.error('Error al finalizar el registro:', error.message);
        res.status(500).json({ error: 'Error al finalizar el registro.' });
    }
};
