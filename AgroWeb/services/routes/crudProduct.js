const express = require('express');
const router = express.Router();
const upload = require('..//controllers/middleware/upload');
const authenticateJWT = require('../controllers/middleware/authenticateJWT')
const verifySellerRole = require('../controllers/middleware/verifySellerRole')

const  {
    createProduct, 
    getAllProducts, 
    getProductsByCategory, 
    editProduct, 
    deleteProduct
}  = require('../controllers/Seller/EditProduct/CrudProduct');

router.post('/create',authenticateJWT, verifySellerRole,upload.single('imagen'), createProduct);
router.get('/all', authenticateJWT, verifySellerRole,getAllProducts);
router.get('/category/:id_categoria', authenticateJWT, verifySellerRole,getProductsByCategory);
router.put('/productos/:id_producto',authenticateJWT, verifySellerRole, upload.single('imagen'), editProduct);
router.delete('/productos/:id_producto', authenticateJWT, verifySellerRole, deleteProduct);

module.exports = router;
