const Producto = require('../../../models/Seller/Producto');
const { Op } = require('sequelize');

// Función para validar y limpiar los datos de entrada
const validarIdItem = (id_item) => {
    if (!id_item) return { valido: false, mensaje: 'El id_item es requerido.' };
    if (isNaN(id_item)) return { valido: false, mensaje: 'El id_item debe ser un número válido.' };
    return { valido: true };
};

const calcularPrecioPromedio = (productos) => {
    const totalPrecios = productos.reduce((acumulador, producto) => acumulador + parseFloat(producto.precio), 0);
    return productos.length ? (totalPrecios / productos.length) : 0;
};

// Controlador para obtener el precio promedio y la cantidad de productos de un item
exports.getAveragePriceByItem = async (req, res) => {
    const { id_item } = req.body;

    // Validar el id_item
    const { valido, mensaje } = validarIdItem(id_item);
    if (!valido) {
        return res.status(400).json({ error: mensaje });
    }

    try {
        // Buscar productos asociados al id_item y validar que el precio sea positivo
        const productos = await Producto.findAll({
            where: {
                id_item,
                precio: { [Op.gte]: 0 }  // Validar que los precios sean mayores o iguales a 0
            },
            attributes: ['precio'],  // Obtener solo los precios
            raw: true                 // Retornar solo los datos
        });

        // Calcular el precio promedio y la cantidad de productos
        const averagePrice = calcularPrecioPromedio(productos);
        const itemCount = productos.length; // Cantidad de productos con el mismo id_item

        // Enviar respuesta con el precio promedio y la cantidad de productos
        return res.status(200).json({ 
            averagePrice: averagePrice.toFixed(2), 
            itemCount 
        });

    } catch (error) {
        console.error('Error al obtener el precio promedio del item:', error);
        
        // Manejar posibles errores de base de datos o internos
        if (error.name === 'SequelizeConnectionError') {
            return res.status(500).json({ error: 'Error de conexión a la base de datos al obtener el precio promedio.' });
        } else if (error.name === 'SequelizeDatabaseError') {
            return res.status(500).json({ error: 'Error en la base de datos al obtener el precio promedio.' });
        } else {
            return res.status(500).json({ error: 'Error interno al obtener el precio promedio.' });
        }
    }
};
