// src/models/usuario-model.js
const { connectDB, sql } = require("../database/database");

const guardarUsuario = async (usuario) => {
    try {
        const pool = await connectDB(); // Obtiene el pool de conexiones
        const request = pool.request(); // Crea una nueva solicitud

        // Asegúrate de que los nombres de las columnas coincidan EXACTAMENTE con tu tabla en Azure SQL Database
        // Y usa @nombre_parametro para los placeholders
        const sqlQuery = `INSERT INTO usuarios (username, email, password, profilePhoto, phone, address, status)
                          VALUES (@username, @email, @password, @profilePhoto, @phone, @address, @status)`;

        // Añade los parámetros, especificando el tipo de dato SQL para cada uno
        // NVarChar es un tipo común para cadenas de texto en SQL Server
        request.input('username', sql.NVarChar, usuario.nombre);
        request.input('email', sql.NVarChar, usuario.correo);
        request.input('password', sql.NVarChar, usuario.contraseña);
        request.input('profilePhoto', sql.NVarChar, usuario.perfil);
        request.input('phone', sql.NVarChar, usuario.phone); // Ajusta el tipo de dato si es diferente (ej. sql.Int para números)
        request.input('address', sql.NVarChar, usuario.address); // Ajusta el tipo de dato si es diferente
        request.input('status', sql.NVarChar, usuario.tipo); // Ajusta el tipo de dato si es diferente

        const result = await request.query(sqlQuery);
        return result; // result contendrá información sobre la inserción (ej. rowsAffected)
    } catch (err) {
        console.error("Error al ejecutar INSERT en guardarUsuario:", err);
        throw err; // Vuelve a lanzar el error para que sea capturado en el controlador
    }
};

// const buscarUsuarioPorCorreo = (correo) => {
//     return new Promise((resolve, reject) => {
//         const sql = "SELECT * FROM usuarios WHERE correo_electronico = ?";
//         db.query(sql, [correo], (err, results) => {
//             if (err) return reject(err);
//             resolve(results[0]); // devuelve el primer resultado o undefined
//         });
//     });
// };

const buscarUsuarioPorCorreo = async (correo) => {
    try {
        const pool = await connectDB();
        const request = pool.request();

        // Asegúrate de que el nombre de la columna ('email' o 'correo_electronico') coincida con tu DB
        // Y usa @nombre_parametro para el placeholder
        const sqlQuery = "SELECT id, username, email, password, profilePhoto, phone, address, status FROM usuarios WHERE email = @correo";
        request.input('correo', sql.NVarChar, correo); // Especifica el tipo de dato

        const results = await request.query(sqlQuery);
        // 'recordset' es la propiedad de mssql que contiene las filas de resultados
        return results.recordset[0]; // devuelve el primer resultado o undefined
    } catch (err) {
        console.error("Error al buscar usuario por correo:", err);
        throw err;
    }
};

module.exports = {
    guardarUsuario,
    buscarUsuarioPorCorreo
};