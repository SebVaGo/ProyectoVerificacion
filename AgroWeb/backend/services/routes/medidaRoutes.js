const express = require('express');
const router = express.Router();

const {getMedida, getMedidas} = require('../controllers/Seller/EditProduct/Medida');

router.get('/medidas', getMedidas);
router.get('/medida/:id_medida', getMedida);

module.exports = router;
