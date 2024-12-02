const Producto = require('../../../models/Seller/Producto');
const Item = require('../../../models/Seller/Item');
const Medida = require('../../../models/Seller/Medida');
const Categoria = require('../../../models/Seller/Categoria');
const Usuario = require('../../../models/Register/Usuario');
const DatosDNI = require('../../../models/Register/DatosDNI');
const Empresa = require('../../../models/Register/Empresa');
const { sendBuyerContactEmail } = require('../../Register/utils/mailService');
const { Op } = require('sequelize');

// Función para obtener el nombre del vendedor según el dni_ruc
const obtenerNombreVendedor = async (dni_ruc) => {
    let nombreVendedor = '';
    if (dni_ruc.length === 8) {
        // Si es una persona con DNI
        const datosDNI = await DatosDNI.findOne({ where: { dni: dni_ruc }, attributes: ['primer_nombre', 'apellido_paterno'] });
        if (datosDNI) {
            nombreVendedor = `${datosDNI.primer_nombre} ${datosDNI.apellido_paterno}`;
        }
    } else if (dni_ruc.length === 11) {
        // Si es una empresa con RUC
        const empresa = await Empresa.findOne({ where: { ruc: dni_ruc }, attributes: ['razon_social'] });
        if (empresa) {
            nombreVendedor = empresa.razon_social;
        }
    }
    return nombreVendedor;
};

// Función para obtener productos con sus asociaciones
const obtenerProductosConAsociaciones = async (filtro = {}) => {
    return await Producto.findAll({
        attributes: ['id_producto', 'descripcion', 'precio', 'stock', 'imagen_url'],
        include: [
            {
                model: Item,
                as: 'Item',
                attributes: ['nombre_item'],
                include: [{ model: Categoria, as: 'Categoria', attributes: ['nombre_categoria'] }] // Incluir la categoría correctamente
            },
            { model: Medida, as: 'Medida', attributes: ['nombre'] }, // Incluir la medida
            {
                model: Usuario,
                as: 'Usuario',
                attributes: ['dni_ruc', 'correo', 'telefono', 'created_at']
            }
        ],
        where: filtro
    });
};

exports.getAllProductsPublic = async (req, res) => {
    try {
        const productos = await obtenerProductosConAsociaciones();

        if (productos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos disponibles.' });
        }

        // Mapeamos los productos y añadimos la información completa del vendedor
        const productosConVendedor = await Promise.all(productos.map(async (producto) => {
            const vendedor = await obtenerNombreVendedor(producto.Usuario.dni_ruc);
            return {
                id_producto: producto.id_producto,
                descripcion: producto.descripcion,
                precio: producto.precio,
                stock: producto.stock,
                imagen_url: producto.imagen_url,
                nombre_item: producto.Item.nombre_item, // Devolvemos el nombre del item directamente
                categoria: producto.Item.Categoria.nombre_categoria, // Devolvemos la categoría directamente
                medida: producto.Medida.nombre, // Devolvemos la medida directamente
                vendedor: {
                    nombre: vendedor, // Aquí agregamos el nombre del vendedor obtenido
                    correo: producto.Usuario.correo || 'Correo no disponible',
                    telefono: producto.Usuario.telefono || 'Teléfono no disponible',
                    fecha_creacion: producto.Usuario.created_at ? producto.Usuario.created_at.toISOString() : 'Fecha no disponible'
                }
            };
        }));

        res.status(200).json({ productos: productosConVendedor });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
};

// Función para obtener productos filtrados
exports.getFilteredProducts = async (req, res) => {
    const { categoria, minPrice, maxPrice, order } = req.body;

    try {
        const filtro = {};

        if (categoria && categoria !== 'todas') {
            filtro['$Item.id_categoria$'] = categoria;
        }

        if (minPrice && maxPrice && !isNaN(minPrice) && !isNaN(maxPrice) && minPrice >= 0 && maxPrice >= 0) {
            filtro.precio = { [Op.between]: [minPrice, maxPrice] };
        }

        const sortOrder = (order === 'DESC' || order === 'ASC') ? order : 'ASC';

        const productos = await Producto.findAll({
            attributes: ['id_producto', 'descripcion', 'precio', 'stock', 'imagen_url'],
            include: [
                {
                    model: Item,
                    as: 'Item',
                    attributes: ['nombre_item'],
                    include: [{ model: Categoria, as: 'Categoria', attributes: ['nombre_categoria'] }] // Devolvemos la categoría directamente
                },
                { model: Medida, as: 'Medida', attributes: ['nombre'] }, // Devolvemos la medida directamente
                { model: Usuario, as: 'Usuario', attributes: ['dni_ruc', 'correo', 'telefono', 'created_at'] }
            ],
            where: filtro,
            order: [['precio', sortOrder]]
        });

        if (productos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos.' });
        }

        const productosConVendedor = await Promise.all(productos.map(async (producto) => {
            const vendedor = await obtenerNombreVendedor(producto.Usuario.dni_ruc);
            return {
                id_producto: producto.id_producto,
                descripcion: producto.descripcion,
                precio: producto.precio,
                stock: producto.stock,
                imagen_url: producto.imagen_url,
                nombre_item: producto.Item.nombre_item, // Devolvemos el nombre del item
                categoria: producto.Item.Categoria.nombre_categoria, // Devolvemos la categoría directamente
                medida: producto.Medida.nombre, // Devolvemos la medida directamente
                vendedor: {
                    nombre: vendedor, // Aquí agregamos el nombre del vendedor obtenido
                    correo: producto.Usuario.correo || 'Correo no disponible',
                    telefono: producto.Usuario.telefono || 'Teléfono no disponible',
                    fecha_creacion: producto.Usuario.created_at ? producto.Usuario.created_at.toISOString() : 'Fecha no disponible'
                }
            };
        }));

        res.status(200).json({ productos: productosConVendedor });
    } catch (error) {
        console.error('Error al aplicar los filtros:', error);
        res.status(500).json({ error: 'Error al aplicar los filtros.' });
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.findAll({
            attributes: ['nombre_item', 'id_item'],
        });

        if (items.length === 0) {
            return res.status(404).json({ message: "No se encontraron productos" });
        }

        res.status(200).json({ items });
    } catch (error) {
        console.error('Error al obtener los items:', error);
        res.status(500).json({ message: "Ocurrió un error con el servidor" });
    }
};


// controllers/productoController.js
exports.contactSeller = async (req, res) => {
    console.log('Entrando a contactSeller...');
    const { sellerEmail, buyerId, productName, productDescription } = req.body; // Recibe los nuevos parámetros
    console.log('sellerEmail:', sellerEmail, 'buyerId:', buyerId, 'productName:', productName, 'productDescription:', productDescription);

    try {
        const vendedor = await Usuario.findOne({ where: { correo: sellerEmail, id_tipo_usuario: 2 } }); // 2 = VENDEDOR
        if (!vendedor) {
            console.log('El vendedor no existe o no tiene un perfil de vendedor.');
            return res.status(404).json({ message: 'El vendedor no existe o no tiene un perfil de vendedor.' });
        }

        const rolesPermitidos = [1, 2];
        const comprador = await Usuario.findOne({
            where: {
                id_usuario: buyerId,
                id_tipo_usuario: rolesPermitidos
            }
        });

        if (!comprador) {
            console.log('El comprador no existe o no tiene un rol permitido.');
            return res.status(404).json({ message: 'El comprador no existe o no tiene un rol permitido.' });
        }

        const buyerEmail = comprador.correo;
        console.log('Correo del comprador:', buyerEmail);

        // Enviar el correo al vendedor con la información del comprador y los detalles del producto
        await sendBuyerContactEmail(sellerEmail, buyerEmail, productName, productDescription);
        console.log('Correo enviado correctamente');

        res.status(200).json({ message: 'Correo enviado al vendedor con la información del comprador.' });
    } catch (error) {
        console.error('Error al enviar el correo al vendedor:', error);
        res.status(500).json({ error: 'Error al enviar el correo al vendedor.' });
    }
};

exports.getProductsBySellerEmail = async (req, res) => {
    const { sellerEmail } = req.body;

    if (!sellerEmail) {
        return res.status(400).json({ error: 'Correo del vendedor no proporcionado.' });
    }

    try {
        // Buscar el primer perfil que tenga el correo proporcionado y el rol de "VENDEDOR"
        const vendedor = await Usuario.findOne({ 
            where: { 
                correo: sellerEmail, 
                id_tipo_usuario: 2  // 2 = VENDEDOR
            }
        });

        if (!vendedor) {
            return res.status(404).json({ message: 'No se encontró un vendedor con ese correo.' });
        }

        // Buscar los productos asociados al vendedor
        const productos = await Producto.findAll({
            where: { id_usuario: vendedor.id_usuario },  // Filtrar por el ID del usuario vendedor
            include: [
                { 
                    model: Item, 
                    as: 'Item', 
                    attributes: ['nombre_item'],
                    include: [{ model: Categoria, as: 'Categoria', attributes: ['nombre_categoria'] }]  // Incluir la categoría del Item
                },
                { 
                    model: Medida, 
                    as: 'Medida', 
                    attributes: ['nombre']  // Incluir la medida en el Producto
                }
            ],
        });

        if (productos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos para este vendedor.' });
        }

        // Mapear productos para devolver la misma estructura de datos
        const productosConVendedor = productos.map((producto) => ({
            id_producto: producto.id_producto,
            descripcion: producto.descripcion,
            precio: producto.precio,
            stock: producto.stock,
            imagen_url: producto.imagen_url,
            nombre_item: producto.Item.nombre_item,
            categoria: producto.Item.Categoria.nombre_categoria,
            medida: producto.Medida.nombre,
            vendedor: {
                nombre: vendedor.nombre,  // Nombre del vendedor
                correo: vendedor.correo,
                telefono: vendedor.telefono || 'Teléfono no disponible',
                fecha_creacion: vendedor.created_at ? vendedor.created_at.toISOString() : 'Fecha no disponible'
            }
        }));

        res.status(200).json({ productos: productosConVendedor });
    } catch (error) {
        console.error('Error al obtener los productos del vendedor:', error);
        res.status(500).json({ error: 'Error al obtener los productos del vendedor.' });
    }
};

exports.getProductsByCategoryName = async (req, res) => {
    const { categoryName } = req.body;

    if (!categoryName) {
        return res.status(400).json({ error: 'Nombre de la categoría no proporcionado.' });
    }

    try {
        // Buscar la categoría por nombre
        const categoria = await Categoria.findOne({
            where: { nombre_categoria: categoryName }
        });

        if (!categoria) {
            return res.status(404).json({ message: 'No se encontró una categoría con ese nombre.' });
        }

        // Buscar los productos asociados a la categoría y mapear las relaciones adecuadas
        const productos = await Producto.findAll({
            attributes: ['id_producto', 'descripcion', 'precio', 'stock', 'imagen_url'],
            include: [
                {
                    model: Item,
                    as: 'Item',
                    attributes: ['nombre_item'],
                    where: { id_categoria: categoria.id_categoria }, // Filtrar por el ID de la categoría encontrada
                    include: [{ model: Categoria, as: 'Categoria', attributes: ['nombre_categoria'] }]
                },
                {
                    model: Medida,
                    as: 'Medida',
                    attributes: ['nombre']
                },
                {
                    model: Usuario,
                    as: 'Usuario',
                    attributes: ['dni_ruc', 'correo', 'telefono', 'created_at']
                }
            ]
        });

        if (productos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos para esta categoría.' });
        }

        // Mapear productos para devolver la estructura de datos deseada
        const productosConCategoria = await Promise.all(productos.map(async (producto) => {
            // Obtener el nombre completo del vendedor (persona o empresa) usando dni_ruc
            const vendedorNombre = await obtenerNombreVendedor(producto.Usuario.dni_ruc);
            
            return {
                id_producto: producto.id_producto,
                descripcion: producto.descripcion,
                precio: producto.precio,
                stock: producto.stock,
                imagen_url: producto.imagen_url,
                nombre_item: producto.Item.nombre_item,
                categoria: producto.Item.Categoria.nombre_categoria,
                medida: producto.Medida.nombre,
                vendedor: {
                    nombre: vendedorNombre,
                    correo: producto.Usuario.correo,
                    telefono: producto.Usuario.telefono || 'Teléfono no disponible',
                    fecha_creacion: producto.Usuario.created_at ? producto.Usuario.created_at.toISOString() : 'Fecha no disponible'
                }
            };
        }));

        res.status(200).json({ productos: productosConCategoria });
    } catch (error) {
        console.error('Error al obtener los productos por categoría:', error);
        res.status(500).json({ error: 'Error al obtener los productos por categoría.' });
    }
};


exports.countStatistics = async (req, res) => {
    try {
        // Contar el número de productos
        const totalProductos = await Producto.count() || 0;

        // Contar el número de usuarios con perfil de vendedor
        const totalVendedores = await Usuario.count({
            where: { id_tipo_usuario: 2 }  // 2 = VENDEDOR
        }) || 0;

        // Contar el número de usuarios con perfil de comprador
        const totalCompradores = await Usuario.count({
            where: { id_tipo_usuario: 1 }  // 1 = COMPRADOR
        }) || 0;

        // Verificar si no hay productos, vendedores o compradores y dar respuesta adecuada
        if (totalProductos === 0 && totalVendedores === 0 && totalCompradores === 0) {
            return res.status(200).json({
                message: "No se encontraron productos, vendedores ni compradores en la base de datos.",
                totalProductos,
                totalVendedores,
                totalCompradores
            });
        }

        // Respuesta con los conteos
        res.status(200).json({
            totalProductos,
            totalVendedores,
            totalCompradores
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);

        // Manejo de errores según el tipo de error
        if (error.name === 'SequelizeConnectionError') {
            return res.status(500).json({
                error: 'Error de conexión a la base de datos al obtener las estadísticas.'
            });
        } else if (error.name === 'SequelizeDatabaseError') {
            return res.status(500).json({
                error: 'Error en la base de datos al obtener las estadísticas.'
            });
        } else {
            return res.status(500).json({
                error: 'Error desconocido al obtener las estadísticas.'
            });
        }
    }
};

