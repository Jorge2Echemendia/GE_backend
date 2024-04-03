import Usuario from "../models/Usuario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
    const { email, nombre } = req.body;
    // Prevenir usuarios duplicados
    const existeUsuario = await Usuario.findOne({ where: { email } });

    if (existeUsuario) {
        const error = new Error('Usuario ya Registrado');
        return res.status(400).json({ msg: error.message });
    }
    try {
        // Guardar un usuario
        const usuario = await Usuario.create(req.body);
        
        //Enviar Email
        emailRegistro({email,nombre,token:usuario.token});
         res.json({msg: "Creado Correctamente, revisa tu email"});   
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al registrar el usuario" });
    }
};

const perfil = (req, res) => {
    const {usuario} = req;
    res.json( usuario);
};

const confirmar = async (req, res) => {
    const { token } = req.params;

    const usuarioConfirmar1 = await Usuario.findOne({ where: { token } });
    
    if (!usuarioConfirmar1 ) {
        const error = new Error("Token no valido");
        return res.status(404).json({ msg: error.message });
    } 
        try {
            // Ahora es seguro acceder a usuarioConfirmar.token
            usuarioConfirmar1.token = null;
            usuarioConfirmar1.confirmado = true;
            await usuarioConfirmar1.save();
            res.json({ msg: "Usuario Confirmando Correctamente" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Error al confirmar el usuario" });
        }
    
};

const autenticar = async (req, res) => {
    const { email, password, tipo_usuario  } = req.body;

    // Verificando si el usuario Existe
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
        const error = new Error("El usuario no existe");
        return res.status(404).json({ msg: error.message });
    }

    // Comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        const error = new Error("La cuenta no ah sido confirmada");
        return res.status(403).json({ msg: error.message });
    }

    // Revisar el password
    const passwordCorrecta = await usuario.comprobarPassword(password);
    if (passwordCorrecta) {
        // Autenticars
        res.json({ 
            id_usuario:usuario.id_usuario,
            nombre:usuario.nombre,
            email:usuario.email,
            tipo_usuario:usuario.tipo_usuario,
            token: generarJWT(usuario.id_usuario) });
    } else {
        const error = new Error("La contraseña es incorrecto");
        return res.status(403).json({ msg: error.message });
    }
};

const olvidePassword = async (req, res) => {
    const { email } = req.body;

    const existeUsuario = await Usuario.findOne({ where: { email } });
    if (!existeUsuario) {
        const error = new Error("El usuario no existe");
        return res.status(400).json({ msg: error.message });
    }

    try {
        existeUsuario.token = generarId();
        await existeUsuario.save();
        //Enviar Email
        emailOlvidePassword({email, nombre:existeUsuario.nombre,token:existeUsuario.token});
        res.json({ msg: "Hemos enviado una email con las instrucciones" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al procesar la solicitud de olvidar contraseña" });
    }
};

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const tokenValido = await Usuario.findOne({ where: { token } });
    if (tokenValido) {
        return res.json({ msg: "Token Valido y existe el usuario" });
    } else {
        const error = new Error("Token no Valido");
        return res.status(400).json({ msg: error.message });
    }
};

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({ where: { token } });
    if (!usuario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({ msg: error.message });
    }
    try {
        usuario.token = null;
        usuario.password = password; // Asegúrate de que el modelo Usuario tenga un método para encriptar la contraseña
        await usuario.save();
        res.json({ msg: "Password modificado correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al cambiar la contraseña" });
    }
};

export {
    registrar,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}