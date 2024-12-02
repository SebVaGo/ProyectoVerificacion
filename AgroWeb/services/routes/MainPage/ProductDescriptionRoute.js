const express = require('express');
const router = express.Router();

const {
    getProductDetails,
    getProductsByItem,
} = require('../../controllers/MainPage/Products/ProductDescriptionController');

router.post('/description', getProductDetails);
router.post('/byitem', getProductsByItem);
module.exports = router;

