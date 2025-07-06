// src/controller/auth-controller.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuarioModel = require("../models/usuario-model");
const registroService = require("../services/registro-services"); // Asegúrate de que este servicio exista y sea correcto

// The secret key for JWT. It's good practice to get it from environment variables.
const SECRET = process.env.JWT_SECRET || "your_super_secret_key"; // Consider using a more complex key in production

const loginUsuario = async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        // Search for the user by email in the database
        const usuario = await usuarioModel.buscarUsuarioPorCorreo(correo);

        // If the user is not found, return a 404 error
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        // Compare the provided password with the hashed password from the database
        // IMPORTANT! 'usuario.password' is used here because that's the column name in your DB
        const contraseñaValida = await bcrypt.compare(contraseña, usuario.password);

        // If the password is not valid, return a 401 error (Unauthorized)
        if (!contraseñaValida) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }

        // If credentials are valid, create a payload for the JWT token
        const payload = {
            id: usuario.id,
            tipo: usuario.status // Assuming 'status' is the field that defines the user type (client/admin)
        };

        // Generate the JWT token
        const token = jwt.sign(payload, SECRET, { expiresIn: "1h" }); // Token expires in 1 hour

        // Return the token and user type in the response
        res.status(200).json({ token, tipo: usuario.status }); // Return 'status' as 'tipo'
    } catch (error) {
        // Catch and log any error that occurs during the login process
        console.error("Error al iniciar sesión:", error);
        // Return an internal server error
        res.status(500).json({ mensaje: "Error interno del servidor al iniciar sesión." });
    }
};

const registrarUsuario = async (req, res) => {
    const {nombre, correo, contraseña, perfil, phone, address} = req.body;

    try {
        // HASH THE PASSWORD BEFORE STORING IT IN THE DATABASE
        // This is a critical security step.
        const hashedPassword = await bcrypt.hash(contraseña, 10); // 10 is the saltRounds, a good default value

        const nuevoUsuario = {
            nombre,
            correo,
            contraseña: hashedPassword, // Store the hashed password
            perfil,
            phone,
            address,
            tipo: "cliente" // Static value for the 'status' field in the DB
        };

        // Call the registration service to save the new user
        await registroService.registrarUsuario(nuevoUsuario);
        res.status(201).json({ mensaje: "Usuario registrado con éxito." });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        // Note: 'ER_DUP_ENTRY' is a MySQL error code.
        // For SQL Server, a duplicate entry error on a unique key is typically error number 2627.
        // If you have a UNIQUE constraint on 'email', you can handle it like this:
        if (error.originalError && error.originalError.info && error.originalError.info.number === 2627) {
            return res.status(409).json({ mensaje: "El correo electrónico ya está registrado." });
        }
        res.status(500).json({ mensaje: "Error al registrar usuario." });
    }
};

module.exports = {
    loginUsuario,
    registrarUsuario
};