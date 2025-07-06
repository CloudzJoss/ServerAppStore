// src/routes/cliente-routes.js
const express = require("express");
const router = express.Router();
const { verificarToken, autorizarRol } = require("../middleware/auth-middleware");

// Ruta para que un cliente vea su propio perfil
router.get("/mi-perfil", verificarToken, autorizarRol(["cliente", "administrador"]), (req, res) => {
    // La lógica aquí sería buscar el perfil del usuario usando req.usuario.id
    // y asegurarse de que el cliente solo pueda ver su propio perfil.
    console.log(`Usuario ${req.usuario.tipo} ${req.usuario.id} accedió a su perfil.`);
    res.status(200).json({
        mensaje: "Bienvenido a tu perfil.",
        perfilDeUsuario: {
            id: req.usuario.id,
            tipo: req.usuario.tipo,
            // Aquí podrías agregar más datos del perfil obtenidos de la DB
            nombre: "Nombre del Usuario",
            correo: "correo@ejemplo.com"
        }
    });
});

// Ruta para que un cliente vea sus pedidos
router.get("/mis-pedidos", verificarToken, autorizarRol(["cliente"]), (req, res) => {
    // Lógica para obtener los pedidos del usuario req.usuario.id
    console.log(`Usuario cliente ${req.usuario.id} accedió a sus pedidos.`);
    res.status(200).json({
        mensaje: "Aquí están tus pedidos.",
        pedidos: ["Pedido 1", "Pedido 2"]
    });
});

module.exports = router;