const axios = require('axios');
const Empresa = require('../../../models/Register/Empresa');

const fetchRucData = async (req, res, next) => {
    const ruc = req.body.ruc.toString(); // Convertir el RUC a string para asegurar que se maneje correctamente
    console.log('Valor recibido en fetchRucData:', ruc);

    try {
        // Verificar si el RUC ya existe en la base de datos
        let empresa = await Empresa.findOne({ where: { ruc } });

        if (!empresa) {
            // Configuración de la solicitud a API Peru Dev
            console.log("Iniciando consulta a API Peru con RUC:", ruc);

            const response = await axios.post(
                'https://apiperu.dev/api/ruc',
                { ruc: ruc },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.DNI_API_KEY}` // Asegúrate de que esta variable esté correctamente configurada
                    }
                }
            );

            if (response.data.success) {
                console.log("Datos recibidos de la API:", response.data.data);

                const {
                    nombre_o_razon_social: razon_social,  // Corregir nombre del campo
                    direccion_completa: direccion,
                    departamento,
                    provincia,
                    distrito,
                    estado,
                    condicion
                } = response.data.data;

                // Crear una nueva entrada en la tabla Empresa
                empresa = await Empresa.create({
                    ruc,
                    razon_social,
                    direccion,
                    departamento,
                    provincia,
                    distrito,
                    estado,
                    condicion
                });

                console.log("Datos de la empresa guardados en la base de datos:", empresa);
            } else {
                return res.status(400).json({ error: 'No se pudo obtener la información del RUC.' });
            }
        }

        // Guarda el id_empresa para usarlo en el controlador
        req.rucData = {
            id_empresa: empresa.id_empresa
        };

        next();

    } catch (error) {
        console.error('Error al obtener datos del RUC desde API Peru Dev:', error.message);
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Error al obtener datos del RUC desde API Peru Dev.' });
        }
    }
};

module.exports = fetchRucData;
