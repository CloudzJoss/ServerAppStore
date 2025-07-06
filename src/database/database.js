// src/database/database.js
const sql = require("mssql"); // ¡Asegúrate que esta sea la línea correcta!
const config = require("../../config"); // Tu archivo config.js con las variables de entorno

// Configuración para mssql, usando tus variables de entorno a través de config
const dbConfig = {
    user: config.basedatos.user,
    password: config.basedatos.password,
    server: config.basedatos.host, // 'host' en tu config.js es 'server' en mssql
    database: config.basedatos.database,
    options: {
        encrypt: true, // ¡¡¡FUNDAMENTAL para Azure SQL Database (conexión segura)!!!
        trustServerCertificate: false // Recomendado en producción; para desarrollo podrías probar 'true' temporalmente si hay problemas de certificado, pero 'false' es más seguro.
    },
    // El puerto viene de tu .env a través de config, y es 1433 para SQL Server.
    port: parseInt(config.basedatos.port) // Asegúrate que el puerto sea un número
};

let pool; // Variable para almacenar el pool de conexiones

// Función asíncrona para conectar y devolver el pool de conexiones
const connectDB = async () => {
    try {
        // Si el pool ya existe y está conectado, lo reutilizamos
        if (pool && pool.connected) {
            console.log("¡Reutilizando conexión existente con la base de datos!");
            return pool;
        }

        // Si no hay pool o no está conectado, creamos uno nuevo
        pool = new sql.ConnectionPool(dbConfig);
        await pool.connect();
        console.log("Servidor conectado con la base de datos con éxito!"); // Mensaje de éxito
        return pool;
    } catch (err) {
        console.error("❌ ERROR al conectar con la base de datos:", err.message); // Mensaje de error
        // Añadir más contexto al error para facilitar la depuración
        if (err.code === 'ECONNRESET') {
             console.error("    -> Causa probable: Firewall de Azure SQL (tu IP no está permitida) o credenciales incorrectas (usuario/contraseña).");
             console.error("    -> Verifica tu dirección IP pública en Google y añádela como regla de firewall en el Azure Portal (sección 'Networking' de tu SQL Server).");
             console.error("    -> También, confirma que el usuario ('Admin_ZenaydaStore') y la contraseña sean exactamente correctos.");
        } else if (err.code === 'ETIMEDOUT') {
            console.error("    -> Causa probable: El servidor de la base de datos no respondió a tiempo. Podría ser un firewall bloqueando la conexión o problemas de red.");
        } else if (err.code === 'ENOTFOUND') {
            console.error("    -> Causa probable: El nombre del servidor ('sqlserver-zenaydatastore.database.windows.net') no pudo ser resuelto. Revisa que esté escrito correctamente.");
        } else if (err.message.includes('Login failed')) { // Algunas versiones de mssql pueden dar este mensaje en el error.message
            console.error("    -> Causa probable: El nombre de usuario o la contraseña son incorrectos.");
        }
        throw err; // Vuelve a lanzar el error para que sea manejado en index.js
    }
};

// Exporta la función para obtener el pool y el objeto `sql` (para tipos de datos SQL)
module.exports = {
    connectDB,
    sql
};