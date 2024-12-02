const axios = require('axios');
const DatosDNI = require('../../../models/Register/DatosDNI');

const fetchDniData = async (req, res, next) => {
    const dni = req.body.dni.toString(); // Convertir el DNI a string para asegurar que se maneje correctamente
    console.log('Valor recibido en fetchDniData:', dni);

    try {
        // Verificar si el DNI ya existe en la base de datos 
        let datosDNI = await DatosDNI.findOne({ where: { dni } });

        if (!datosDNI) {
            // Configuración de la solicitud a API Peru Dev
            console.log("Iniciando consulta a API Peru con DNI:", dni);
            
            const response = await axios.post(
                'https://apiperu.dev/api/dni', 
                { dni: dni },
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
                
                const { nombres, apellido_paterno, apellido_materno } = response.data.data;

                // Crear una nueva entrada en la tabla DatosDNI
                datosDNI = await DatosDNI.create({
                    dni,
                    primer_nombre: nombres.split(' ')[0], // Asumiendo que el primer nombre está en la primera posición
                    segundo_nombre: nombres.split(' ')[1] || '', // El segundo nombre puede no estar presente
                    apellido_paterno,
                    apellido_materno
                });

                console.log("Datos DNI guardados en la base de datos:", datosDNI);
            } else {
                return res.status(400).json({ error: 'No se pudo obtener la información del DNI.' });
            }
        }

        // Guarda el id_datos_dni para usarlo en el controlador
        req.dniData = {
            id_datos_dni: datosDNI.id_datos_dni
        };

        next();

    } catch (error) {
        console.error('Error al obtener datos del DNI desde API Peru Dev:', error.message);
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Error al obtener datos del DNI desde API Peru Dev.' });
        }
    }
};

module.exports = fetchDniData;
