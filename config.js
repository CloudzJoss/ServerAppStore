// config.js
require("dotenv").config(); // Esto carga las variables del .env

const data = {
    port: process.env.PORT,
    basedatos: {
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD
    },
    jwt: {
        cliente: "",
        administrador: ""
    }
}

module.exports = data;