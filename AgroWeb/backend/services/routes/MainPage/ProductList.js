const express = require('express');
const router = express.Router();

const {
    getAllProductsPublic, 
    getAllItems,
    getFilteredProducts,
    contactSeller,
    getProductsBySellerEmail,
    getProductsByCategoryName,
    countStatistics,
} = require('../../controllers/MainPage/Products/ListProducts');

router.get('/all', getAllProductsPublic);
router.get('/items', getAllItems);
router.post('/filter', getFilteredProducts);
router.post('/contact-seller', contactSeller); // Verificar que esta línea esté bien
router.post('/seller-products', getProductsBySellerEmail);
router.get('/statistics', countStatistics);
router.post('/category', getProductsByCategoryName);
console.log('Rutas de product-list registradas correctamente');

module.exports = router;
