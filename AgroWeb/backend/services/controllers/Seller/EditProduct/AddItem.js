const Item = require('../../../models/Seller/Item');

// Crear un nuevo item
exports.createItem = async (req, res) => {
    try {
        const { nombre_item } = req.body;
        const nuevoItem = await Item.create({ nombre_item });
        res.status(201).json(nuevoItem);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el item' });
    }
};

// Obtener todos los items
exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.findAll();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los items' });
    }
};

// Obtener un item por ID
exports.getItemById = async (req, res) => {
    try {
        const { id_item } = req.params;
        const item = await Item.findByPk(id_item);
        if (!item) {
            return res.status(404).json({ error: 'Item no encontrado' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el item' });
    }
};

// Actualizar un item
exports.updateItem = async (req, res) => {
    try {
        const { id_item } = req.params;
        const { nombre_item } = req.body;

        const item = await Item.findByPk(id_item);
        if (!item) {
            return res.status(404).json({ error: 'Item no encontrado' });
        }

        item.nombre_item = nombre_item;
        await item.save();

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el item' });
    }
};

// Eliminar un item
exports.deleteItem = async (req, res) => {
    try {
        const { id_item } = req.params;

        const item = await Item.findByPk(id_item);
        if (!item) {
            return res.status(404).json({ error: 'Item no encontrado' });
        }

        await item.destroy();
        res.status(200).json({ message: 'Item eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el item' });
    }
};
