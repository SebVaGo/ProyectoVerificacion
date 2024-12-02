// routes/obtenerDatosRoutes.js

const express = require('express');
const router = express.Router();
const obtenerDatosController = require('../controllers/Register/ObtenerDatosController');

// Ruta para obtener los datos del usuario
router.post('/obtener-datos', obtenerDatosController.obtenerDatos);

module.exports = router;
