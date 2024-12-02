// routes/tipoUsuarioRoutes.js

const express = require('express');
const router = express.Router();
const tipoUsuarioController = require('../controllers/Register/TipoUsuarioController');

// Ruta para obtener los tipos de usuario
router.get('/tipos-usuario', tipoUsuarioController.getTiposUsuario);

module.exports = router;
