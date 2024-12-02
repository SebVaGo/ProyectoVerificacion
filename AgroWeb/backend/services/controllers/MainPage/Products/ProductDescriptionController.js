const Producto = require('../../../models/Seller/Producto');
const Item = require('../../../models/Seller/Item');
const Medida = require('../../../models/Seller/Medida');
const Categoria = require('../../../models/Seller/Categoria');
const Usuario = require('../../../models/Register/Usuario');
const DatosDNI = require('../../../models/Register/DatosDNI');
const Empresa = require('../../../models/Register/Empresa');

// Función para obtener el nombre del vendedor según el dni_ruc
const obtenerNombreVendedor = async (dni_ruc) => {
    let vendedor = '';
    if (dni_ruc.length === 8) {
        const datosDNI = await DatosDNI.findOne({ where: { dni: dni_ruc }, attributes: ['primer_nombre', 'apellido_paterno'] });
        if (datosDNI) {
            vendedor = `${datosDNI.primer_nombre} ${datosDNI.apellido_paterno}`;
        }
    } else if (dni_ruc.length === 11) {
        const empresa = await Empresa.findOne({ where: { ruc: dni_ruc }, attributes: ['razon_social'] });
        if (empresa) {
            vendedor = empresa.razon_social;
        }
    }
    return vendedor;
};

// Controlador para obtener todos los datos de un producto según su id_producto
exports.getProductDetails = async (req, res) => {
    const { id_producto } = req.body;  // Si estás usando POST, asegúrate de que id_producto viene de req.body

    try {
        // Verifica que id_producto no sea null o undefined antes de continuar
        if (!id_producto) {
            return res.status(400).json({ error: 'ID de producto no proporcionado' });
        }

        // Buscar el producto según el id_producto
        const producto = await Producto.findOne({
            where: { id_producto },
            attributes: ['id_producto', 'descripcion', 'precio', 'stock', 'imagen_url'],
            include: [
                {
                    model: Item,
                    as: 'Item',
                    attributes: ['nombre_item'],
                    include: [{ model: Categoria, as: 'Categoria', attributes: ['nombre_categoria'] }]
                },
                { model: Medida, as: 'Medida', attributes: ['nombre'] },
                { model: Usuario, as: 'Usuario', attributes: ['dni_ruc'] }
            ]
        });

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        const vendedor = await obtenerNombreVendedor(producto.Usuario.dni_ruc);

        const productoDetalles = {
            id_producto: producto.id_producto,
            descripcion: producto.descripcion,
            precio: producto.precio,
            stock: producto.stock,
            imagen_url: producto.imagen_url,
            nombre_item: producto.Item.nombre_item,
            categoria: producto.Item.Categoria.nombre_categoria,
            medida: producto.Medida.nombre,
            vendedor
        };

        res.status(200).json(productoDetalles);
    } catch (error) {
        console.error('Error al obtener los detalles del producto:', error); // Asegúrate de que esto imprime los errores del servidor
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.getProductsByItem = async (req, res) => {
    const { id_item } = req.body;  // Recibir id_item desde el body

    // Verificar que el id_item esté presente en el body
    if (!id_item) {
        return res.status(400).json({ error: 'id_item es requerido en el body de la solicitud.' });
    }

    try {
        // Buscar todos los productos que están asociados al id_item
        const productos = await Producto.findAll({
            where: { id_item },  // Filtrar por id_item
            attributes: ['id_producto', 'descripcion', 'precio', 'stock', 'imagen_url'],
            include: [
                {
                    model: Item,
                    as: 'Item',
                    attributes: ['nombre_item'],
                    include: [{ model: Categoria, as: 'Categoria', attributes: ['nombre_categoria'] }]
                },
                { model: Medida, as: 'Medida', attributes: ['nombre'] },
                { model: Usuario, as: 'Usuario', attributes: ['dni_ruc'] } // Relación con Usuario
            ]
        });

        // Si no se encuentran productos, devolver un mensaje
        if (productos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos asociados a este item.' });
        }

        // Iterar sobre los productos para obtener el nombre del vendedor y preparar la respuesta
        const productosConVendedor = await Promise.all(productos.map(async (producto) => {
            const vendedor = await obtenerNombreVendedor(producto.Usuario.dni_ruc);
            return {
                id_producto: producto.id_producto,
                descripcion: producto.descripcion,
                precio: producto.precio,
                stock: producto.stock,
                imagen_url: producto.imagen_url,
                nombre_item: producto.Item.nombre_item,
                categoria: producto.Item.Categoria.nombre_categoria,
                medida: producto.Medida.nombre,
                vendedor
            };
        }));

        // Devolver la lista de productos con la información completa
        res.status(200).json({ productos: productosConVendedor });
    } catch (error) {
        console.error('Error al obtener los productos por item:', error);
        res.status(500).json({ error: 'Error al obtener los productos por item.' });
    }
};