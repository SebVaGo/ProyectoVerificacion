const Categoria = require('../../../models/Seller/Categoria');
const Item = require('../../../models/Seller/Item');


exports.addCategory = async (req, res) => {
    const { nombre_categoria } = req.body;

    try {
        const categoria = await Categoria.create({ nombre_categoria });
        res.status(201).json({ categoria });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};

exports.getCategories = async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        res.status(200).json({ categorias });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCategory = async (req, res) => {
    const { id_categoria } = req.params;
    try {
        const categoria = await Categoria.findByPk(id_categoria);
        res.status(200).json({ categoria });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    const { id_categoria } = req.params;
    const { nombre_categoria } = req.body;
    try {
        const categoria = await Categoria.findByPk(id_categoria);
        categoria.nombre_categoria = nombre_categoria;
        await categoria.save();
        res.status(200).json({ categoria });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todos los items de una categoría específica
exports.getItemsByCategory = async (req, res) => {
    const { id_categoria } = req.params;

    try {
        const items = await Item.findAll({
            where: { id_categoria },
        });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los items de la categoría' });
    }
};
