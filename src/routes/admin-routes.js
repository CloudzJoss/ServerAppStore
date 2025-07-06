// src/routes/admin-routes.js
const express = require("express");
const router = express.Router();
// Ruta de src/routes a src/middleware
const { verificarToken, autorizarRol } = require("../middleware/auth-middleware");

// Ruta para ver todos los usuarios (solo accesible para administradores)
router.get("/usuarios", verificarToken, autorizarRol(["administrador"]), (req, res) => {
    // Aquí iría la lógica para obtener y devolver todos los usuarios de la base de datos
    // Solo se llega aquí si el token es válido Y el usuario es 'administrador'
    console.log(`Usuario administrador ${req.usuario.id} accedió a la lista de usuarios.`);
    res.status(200).json({
        mensaje: "Acceso concedido. Lista de usuarios (solo visible para administradores).",
        usuarioActual: req.usuario // Muestra la información del usuario que hizo la solicitud
    });
});

// Ruta para alguna configuración crítica (solo para administradores)
router.post("/configuracion-sistema", verificarToken, autorizarRol(["administrador"]), (req, res) => {
    // Lógica para actualizar la configuración del sistema
    console.log(`Usuario administrador ${req.usuario.id} actualizó la configuración del sistema.`);
    res.status(200).json({ mensaje: "Configuración del sistema actualizada." });
});

// Solo un administrador con token válido puede acceder a esta ruta
router.post("/crear-usuario", verificarToken, autorizarRol(["administrador"]), async (req, res) => {
    const { nombre, correo, contraseña, tipo } = req.body; // Puedes enviar el tipo ('administrador' o 'cliente')

    const nuevoUsuario = { nombre, correo, contraseña, tipo: tipo || "cliente" };

    try {
        await registroService.registrarUsuario(nuevoUsuario); // Esto hashea y guarda
        res.status(201).json({ mensaje: `Usuario ${tipo || 'cliente'} registrado con éxito.` });
    } catch (error) {
        console.error("Error al crear usuario por admin:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ mensaje: "El correo electrónico ya está registrado." });
        }
        res.status(500).json({ mensaje: "Error al crear usuario." });
    }
});

module.exports = router;
