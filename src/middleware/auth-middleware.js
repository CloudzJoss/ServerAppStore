// src/middleware/auth-middleware.js
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "clave_secreta"; // ¡Recuerda, usa una clave secreta fuerte en producción!

/**
 * Middleware para verificar la validez del token JWT.
 * Adjunta el payload decodificado (incluido el 'tipo' de usuario) a req.usuario.
 */
const verificarToken = (req, res, next) => {
    // El token se espera en el encabezado Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ mensaje: "Token no proporcionado. Se requiere autenticación." });
    }

    const token = authHeader.split(" ")[1]; // Extrae el token después de "Bearer"

    if (!token) {
        return res.status(401).json({ mensaje: "Formato de token inválido. Use Bearer <token>." });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.usuario = decoded; // Ahora req.usuario contendrá { id: ..., tipo: ... }
        next(); // Continúa con la siguiente función de middleware o el controlador de ruta
    } catch (error) {
        console.error("Error al verificar token:", error.message);
        return res.status(403).json({ mensaje: "Token inválido o expirado." });
    }
};

/**
 * Middleware para autorizar el acceso basándose en los roles del usuario.
 * @param {Array<string>} rolesPermitidos - Un array de strings con los roles que tienen permiso para acceder.
 */
const autorizarRol = (rolesPermitidos) => (req, res, next) => {
    // Verificar si verificarToken ya adjuntó la información del usuario
    if (!req.usuario || !req.usuario.tipo) {
        return res.status(401).json({ mensaje: "No hay información de usuario en la solicitud. ¿Se aplicó 'verificarToken'?" });
    }

    // Comprobar si el rol del usuario está incluido en los roles permitidos
    if (!rolesPermitidos.includes(req.usuario.tipo)) {
        return res.status(403).json({ mensaje: "Acceso denegado. Su rol no tiene permisos para esta acción." });
    }

    next(); // El usuario tiene el rol permitido, continuar
};

module.exports = {
    verificarToken,
    autorizarRol,
};