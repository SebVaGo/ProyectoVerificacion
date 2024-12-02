const express = require('express');
const router = express.Router();

const {addCategory, getCategories, getCategory, updateCategory, getItemsByCategory} = require('../controllers/Seller/EditProduct/AddCategory');

router.post('/addCategory', addCategory);
router.get('/getCategories', getCategories);
router.get('/getCategory/:id_categoria', getCategory);
router.put('/updateCategory/:id_categoria', updateCategory);
router.get('/getItemsByCategory/:id_categoria', getItemsByCategory);

module.exports = router;
