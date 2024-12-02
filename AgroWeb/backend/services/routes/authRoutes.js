const express = require('express');
const router = express.Router();
const authController = require('../controllers/Register/AuthController');
const { enviarCodigoVerificacion, verificarCodigo } = require('../controllers/Register/EmailVerificationController');
const obtenerDatosController = require('../controllers/Register/ObtenerDatosController');
const tipoUsuarioController = require('../controllers/Register/TipoUsuarioController');
const { login, leftTime, logout, completeProfile, loginConPerfil} = require('../controllers/Login/LoginController');
const authMiddleware = require('../controllers/Login/middleware/authMiddleware');

// Ruta para obtener los datos del usuario
router.post('/obtener-datos', obtenerDatosController.obtenerDatos);

// Ruta para enviar el código de verificación
router.post('/enviar-codigo', enviarCodigoVerificacion);

// Ruta para verificar el código de verificación
router.post('/verify-email', verificarCodigo);

// Ruta para finalizar el registro después de la confirmación del usuario
router.post('/finalizar-registro', authController.finalizarRegistro);

// Ruta para obtener los tipos de usuario
router.get('/tipos-usuario', tipoUsuarioController.getTiposUsuario);

// Ruta para obtener los datos del usuario
router.post('/login', login);
router.post('/loginConPerfil', loginConPerfil);
router.get('/left-time', leftTime);
router.get('/logout', logout);
router.post('/complete-profile', completeProfile, authMiddleware);

module.exports = router;
