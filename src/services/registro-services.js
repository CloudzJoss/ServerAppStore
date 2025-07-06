const bcrypt = require("bcrypt");
const usuarioModel = require("../models/usuario-model");

const registrarUsuario = async (usuario) => {
    const usuarioHasheado = await hashearContraseña(usuario);
    await usuarioModel.guardarUsuario(usuarioHasheado);
};

const hashearContraseña = async (usuario) => {
    const contraseñaHasheada = await bcrypt.hash(usuario.contraseña, 5);
    return {
        ...usuario,
        contraseña: contraseñaHasheada
    };
};

module.exports = {
    registrarUsuario
};
