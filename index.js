// index.js
// Importa tanto 'app' como 'connectDB' desde app.js (donde app.js las re-exporta)
const { app, connectDB } = require("./app"); // ✅ correcto
const config = require("./config"); // Puedes seguir usando config para otras cosas si es necesario

// Define el puerto. Usar process.env.PORT es la mejor práctica, especialmente para despliegues como Azure.
const PORT = process.env.PORT || 3000; // Usa process.env.PORT para Azure o 3000 por defecto

// Llama a connectDB() y maneja su Promesa ANTES de iniciar el servidor
connectDB()
    .then(() => {
        // Si la conexión a la base de datos fue exitosa, entonces inicia el servidor Express
        console.log("✅ Conexión a la base de datos exitosa.");
        app.listen(PORT, () => {
            console.log(`Servidor Express ejecutándose en http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        // Si la conexión a la base de datos falló, muestra el error y termina la aplicación
        console.error("🚫 La aplicación no pudo iniciarse debido a un error de conexión a la base de datos.");
        console.error(err); // Imprime el error detallado aquí para una mejor depuración
        process.exit(1); // Sale de la aplicación con un código de error (importante para Azure)
    });