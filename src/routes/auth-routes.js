// src/routes/auth-routes.js
const express = require("express");
const router = express.Router();

// **** CAMBIA ESTA LÍNEA ****
// ANTES: const authController = require("../../controller/auth-controller");
// DESPUÉS:
const authController = require("../controller/auth-controller"); // Solo un '..' es necesario

router.post("/iniciar-sesion", authController.loginUsuario);
router.post("/registrar", authController.registrarUsuario);

module.exports = router;