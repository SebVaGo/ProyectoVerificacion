const express = require('express');
const router = express.Router();
const {getProfile, updateProfile} = require('../controllers/Seller/EditProfile/CrudProfile');

router.get('/profile', getProfile);
router.put('/update-profile', updateProfile);


module.exports = router;
