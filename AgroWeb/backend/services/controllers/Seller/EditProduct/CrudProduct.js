const Producto = require('../../../models/Seller/Producto');
const Item = require('../../../models/Seller/Item');
const Medida = require('../../../models/Seller/Medida'); // Importamos el modelo de Medida
const Usuario = require('../../../models/Register/Usuario');
const Categoria = require('../../../models/Seller/Categoria');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

exports.createProduct = async (req, res) => {
    console.log("Iniciando creación de producto...");

    // Verificar si se ha subido una imagen
    let imagen_url = null;
    if (req.file) {
        imagen_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        console.log("Imagen URL generada:", imagen_url);
    } else {
        console.log("No se subió ninguna imagen.");
    }

    const { descripcion, precio, stock, id_item, id_medida } = req.body;
    console.log("Datos recibidos del frontend:", { descripcion, precio, stock, id_item, id_medida });

    try {
        const producto = await Producto.create({
            descripcion,
            precio,
            stock,
            imagen_url,  // Guardamos la URL de la imagen
            id_item,
            id_usuario: req.userId, // Usamos el ID del usuario autenticado (del middleware)
            id_medida
        });
        console.log("Producto creado exitosamente:", producto);

        res.status(201).json({ producto });
    } catch (error) {
        console.error("Error al crear el producto en la base de datos:", error);
        res.status(500).json({ error: error.message });
    }
};


// Obtener todos los productos de un vendedor con filtros
exports.getAllProducts = async (req, res) => {
    try {
        // Buscar los productos del vendedor en base al id_usuario
        const productos = await Producto.findAll({
            where: { id_usuario: req.userId },  // Usamos `req.userId` del middleware
            include: [
                { model: Item, as: 'Item', include: [{ model: Categoria, as: 'Categoria' }] }, // Incluimos la categoría a través del Item
                { model: Medida, as: 'Medida' }, // Incluir Medida
            ],
        });

        res.status(200).json({ productos });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
};

// Obtener los productos por categoría según su id_categoria
exports.getProductsByCategory = async (req, res) => {
    const { id_categoria } = req.params;

    if (!id_categoria) {
        return res.status(400).json({ error: 'ID de categoría no proporcionado.' });
    }

    try {
        // Buscar los productos por categoría
        const productos = await Producto.findAll({
            where: { '$Item.id_categoria$': id_categoria },  // Filtrar por categoría desde Item
            include: [
                { 
                    model: Item, 
                    as: 'Item', 
                    include: [{ model: Categoria, as: 'Categoria' }]  // Incluir la categoría del Item
                },
                { 
                    model: Medida, 
                    as: 'Medida'  // Incluir la medida en el Producto
                }
            ],
        });
    
        if (productos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos para esta categoría.' });
        }
    
        res.status(200).json({ productos });
    } catch (error) {
        console.error('Error al obtener los productos por categoría:', error);
        res.status(500).json({ error: 'Error al obtener los productos por categoría.' });
    }
};

// Editar un producto existente del vendedor
exports.editProduct = async (req, res) => {
    const { id_producto } = req.params; // Se espera que el ID del producto venga en los parámetros de la URL
    const { descripcion, precio, stock, id_item, id_medida } = req.body; // Datos a actualizar

    try {
        // Buscar el producto para asegurarse de que pertenece al usuario
        const producto = await Producto.findOne({
            where: { id_producto, id_usuario: req.userId }, // Verifica que el producto pertenece al usuario autenticado
        });

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado o no pertenece a este usuario.' });
        }

        // Verificar si se ha subido una nueva imagen
        let imagen_url = producto.imagen_url; // Mantener la imagen existente si no se proporciona una nueva
        if (req.file) {
            imagen_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        // Actualizar los datos del producto
        producto.descripcion = descripcion || producto.descripcion;
        producto.precio = precio || producto.precio;
        producto.stock = stock || producto.stock;
        producto.id_item = id_item || producto.id_item;
        producto.id_medida = id_medida || producto.id_medida;
        producto.imagen_url = imagen_url; // Actualiza la imagen solo si se ha proporcionado una nueva

        await producto.save(); // Guardar los cambios en la base de datos

        res.status(200).json({ message: 'Producto actualizado exitosamente', producto });
    } catch (error) {
        res.status(500).json({ error: 'Error al editar el producto.' });
    }
};

// Eliminar un producto existente del vendedor
exports.deleteProduct = async (req, res) => {
    const { id_producto } = req.params; // Se espera que el ID del producto venga en los parámetros de la URL

    try {
        // Buscar el producto para asegurarse de que pertenece al usuario autenticado
        const producto = await Producto.findOne({
            where: { id_producto, id_usuario: req.userId },  // Verifica que el producto pertenece al usuario autenticado
        });

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado o no pertenece a este usuario.' });
        }

        // Eliminar el producto de la base de datos
        await producto.destroy();

        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto.' });
    }
};


    