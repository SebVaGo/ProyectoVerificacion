const express = require('express');
const router = express.Router();

const {
    getAveragePriceByItem,
} = require('../../controllers/MainPage/Products/AveragePriceController');

router.post('/average', getAveragePriceByItem);

module.exports = router;

