const express = require('express');
const router = express.Router();
const { createItem, getAllItems, getItemById, updateItem, deleteItem } = require('../controllers/Seller/EditProduct/AddItem');

// Crear un nuevo item
router.post('/create', createItem);

// Obtener todos los items
router.get('/items', getAllItems);

// Obtener un item por su ID
router.get('/:id_item', getItemById);

// Actualizar un item (necesitas el ID del item)
router.put('/:id_item', updateItem);

// Eliminar un item (necesitas el ID del item)
router.delete('/:id_item', deleteItem);

module.exports = router;
