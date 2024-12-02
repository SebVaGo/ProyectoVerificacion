// controllers/Register/obtenerDatosController.js

const Usuario = require('../../models/Register/Usuario');
const fetchDniData = require('./middleware/fetchDniData');
const fetchRucData = require('./middleware/fetchRucData');
const DatosDNI = require('../../models/Register/DatosDNI'); // Asegúrate de importar el modelo DatosDNI
const Empresa = require('../../models/Register/Empresa'); // Asegúrate de importar el modelo Empresa

exports.obtenerDatos = async (req, res) => {
    const { dni_ruc, id_tipo_usuario } = req.body;
    let datosUsuario = {};

    console.log('dni_ruc', dni_ruc);

    try {
        // Verificar si el DNI o RUC ya está registrado para el mismo tipo de usuario
        const existingUserByDniRucAndType = await Usuario.findOne({ where: { dni_ruc, id_tipo_usuario } });
        if (existingUserByDniRucAndType) {
            return res.status(400).json({
                error: `El ${dni_ruc.length === 11 ? 'RUC' : 'DNI'} ya está registrado como ${existingUserByDniRucAndType.id_tipo_usuario === 1 ? 'COMPRADOR' : 'VENDEDOR'}.`
            });
        }

        // Obtener datos adicionales según el tipo de identificación (DNI o RUC)
        if (dni_ruc.length === 11) {
            // Registro con RUC
            req.body.ruc = dni_ruc;
            await fetchRucData(req, res, () => {});
            
            if (!req.rucData || !req.rucData.id_empresa) {
                return res.status(404).json({ error: 'No se encontraron datos para el RUC proporcionado.' });
            }

            const empresa = await Empresa.findOne({ where: { id_empresa: req.rucData.id_empresa } });
            if (!empresa) {
                return res.status(404).json({ error: 'No se encontró la empresa asociada a ese RUC.' });
            }

            datosUsuario = {
                razon_social: empresa.razon_social,
                direccion: empresa.direccion,
                departamento: empresa.departamento,
                provincia: empresa.provincia,
                distrito: empresa.distrito,
                estado: empresa.estado,
                condicion: empresa.condicion,
            };

        } else if (dni_ruc.length === 8) {
            // Registro con DNI
            req.body.dni = dni_ruc;
            await fetchDniData(req, res, () => {});

            if (!req.dniData || !req.dniData.id_datos_dni) {
                return res.status(404).json({ error: 'No se encontraron datos para el DNI proporcionado.' });
            }

            const datosDNI = await DatosDNI.findOne({ where: { id_datos_dni: req.dniData.id_datos_dni } });
            if (!datosDNI) {
                return res.status(404).json({ error: 'No se encontraron datos asociados a ese DNI.' });
            }

            datosUsuario = {
                primer_nombre: datosDNI.primer_nombre,
                segundo_nombre: datosDNI.segundo_nombre,
                apellido_paterno: datosDNI.apellido_paterno,
                apellido_materno: datosDNI.apellido_materno,
            };
        } else {
            return res.status(400).json({ error: 'El DNI debe tener 8 dígitos y el RUC 11 dígitos.' });
        }

        // Enviar solo los campos relevantes al frontend
        return res.status(200).json({
            message: 'Datos obtenidos con éxito. Por favor, confirma la información antes de continuar.',
            datosUsuario,
        });

    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error.message);
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Error al obtener los datos del usuario.' });
        }
    }
};
