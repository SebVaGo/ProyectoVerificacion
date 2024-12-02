const express = require('express');
const router = express.Router();
const recoveryController = require('../controllers/Recovery/RecoveryController');

router.post('/recuperacion', recoveryController.solicitarRecuperacion);
router.post('/verificar-codigo', recoveryController.verificarCodigoRecuperacion);
router.post('/actualizar-clave', recoveryController.actualizarClave);

module.exports = router;
