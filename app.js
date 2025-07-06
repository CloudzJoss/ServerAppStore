// app.js
require("dotenv").config(); // Asegúrate de que esto esté al principio para cargar las variables
const express = require("express");
const app = express();
// No necesitas importar 'config' aquí para el puerto, ya que 'index.js' lo manejará.

// IMPORTANTE: Asegúrate de que esta ruta sea CORRECTA y que importe 'connectDB'
const { connectDB } = require("./src/database/database");

const authRoutes = require("./src/routes/auth-routes");
const adminRoutes = require("./src/routes/admin-routes");
const clienteRoutes = require("./src/routes/user-routes");

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cliente", clienteRoutes);

app.get("/home", (req, res) => {
    res.send("¡Bienvenido a la página de inicio de la API!");
});

app.use((err, req, res, next) => {
    console.error("Manejador de Errores Global:", err.stack);
    res.status(500).send('¡Algo salió mal!');
});

// *** CLAVE: Exporta la 'app' Y la función 'connectDB' ***
module.exports = { app, connectDB };