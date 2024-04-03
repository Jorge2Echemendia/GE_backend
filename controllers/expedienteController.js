import Expediente from "../models/Expediente.js";
import UsuarioExpediente from "../models/UsuarioExpediente.js";
const crearExpediente = async (req, res) => {
  const { ci } = req.body;
  const { usuario } = req;
  // Verificando que solo la secretaria pueda crear expedientes
  if (usuario.tipo_usuario !== "Secretaria") {
    const error = new Error("No tienes acceso a esta funcionalidad");
    return res.status(403).json({ msg: error.message });
  }
  // Verificando si el Expediente Existe
  const expedienteExiste = await Expediente.findOne({ where: { ci } });

  if (expedienteExiste) {
    const error = new Error("Este expediente ya exite, verifique su CI");
    return res.status(404).json({ msg: error.message });
  }

  try {
    // Guardar un expediente
    const expediente = await Expediente.create(req.body);
    // Crear una entrada en la tabla UsuarioExpediente para conectar el expediente con la Secretaria (N-N)
    await UsuarioExpediente.create({
      id_usuario: usuario.id_usuario,
      id_expediente: expediente.id_expediente,
    });
    res.json({
      msg: `EL expediente del estudiante ${expediente.nombre_estudiante} fue creado correctamente`,expediente
    });
  } catch (error) {
    const err = new Error("Error al Registrar un nuevo expediente");
    return res.status(500).json({ msg: err.message });
  }
};

const listarExpedientes = async (req, res) => {
  const { usuario } = req;
  if (usuario.tipo_usuario === "Profesor") {
    try {
      const expedientes = await Expediente.findAll();
      return res.json(expedientes.reverse());
    } catch (error) {
      const err = new Error("Error al listar los expedientes");
      return res.status(500).json({ msg: err.message });
    }
  }

  try {
    // Obtener el id_usuario de la Secretaria desde el objeto usuario en req
    const id_usuario = usuario.id_usuario;

    // Buscar todas las entradas en UsuarioExpediente que coincidan con el id_usuario de la Secretaria
    const usuarioExpedientes = await UsuarioExpediente.findAll({
      where: { id_usuario },
    });
    // Extraer los id_expediente de las entradas encontradas
    const id_expedientes = usuarioExpedientes.map(
      (expediente) => expediente.id_expediente
    );
    // Buscar los detalles de los expedientes correspondientes
    const expedientes = await Expediente.findAll({
      where: { id_expediente: id_expedientes },
    });

    // Responder con los expedientes encontrados
    res.json(expedientes.reverse());
  } catch (error) {
    const err = new Error("Error al listar los Expedientes");
    return res.status(500).json({ msg: err.message });
  }
};

const listarExpediente = async (req, res) => {
  const { ci } = req.params;
  const { usuario } = req;
  const id_usuario = usuario.id_usuario;

  if (usuario.tipo_usuario === "Secretaria") {
    try {
      // Buscar todas las entradas en UsuarioExpediente que coincidan con el id_usuario de la Secretaria
      const usuarioExpedientes = await UsuarioExpediente.findAll({
        where: { id_usuario },
      });
      // Extraer los id_expediente de las entradas encontradas
      const id_expedientes = usuarioExpedientes.map(
        (expediente) => expediente.id_expediente
      );
      // Buscar los detalles de los expedientes correspondientes
      const expedientes = await Expediente.findAll({
        where: { id_expediente: id_expedientes },
      });
      const expedienteEncontrado = expedientes.find(
        (expediente) => expediente.ci === ci
      );
      return res.json(expedienteEncontrado);
    } catch (error) {
      const err = new Error("Error al listar el expediente");
      return res.status(500).json({ msg: err.message });
    }
  } else {
    try {
      const expediente = await Expediente.findOne({
        where: { ci },
      });
      res.json(expediente);
    } catch (error) {
      const err = new Error("Error al listar el expediente");
      return res.status(500).json({ msg: err.message });
    }
  }
};

const actualizarExpediente = async (req, res) => {
  const { ci } = req.params;
  const expediente = await Expediente.findOne({ where: { ci } });
  
  if (!expediente) {
    return res.status(404).json({ msg: "Este Expediente no existe, revise su CI" });
  }

  expediente.nombre_estudiante =
    req.body.nombre_estudiante || expediente.nombre_estudiante;
  expediente.apellido_estudiante =
    req.body.apellido_estudiante || expediente.apellido_estudiante;
  expediente.direccion_estudiante =
    req.body.direccion_estudiante || expediente.direcion_estudiante;
  expediente.telefono_estudiante =
    req.body.telefono_estudiante || expediente.telefono_estudiante;
  expediente.promedio = req.body.promedio || expediente.promedio;
  expediente.ci = req.body.ci || expediente.ci;
  const existe = await Expediente.findOne({ where: { ci: expediente.ci } });
  if (expediente.ci !== ci) {
    if (existe) {
      return res.status(404).json({ msg: "Existe un expediente con credenciales iguales, revise su CI" });
    }
  }

  try {
    await expediente.save();

    res.json({ msg: "Se ha actualizado Correctamente", expediente });
  } catch (error) {
    const err = new Error("Error al actualizar expediente");
    return res.status(500).json({ msg: err.message });
  }
};

const actualizarExpedienteProfesor = async (req,res) => {
  const { ci } = req.params;
  const expediente = await Expediente.findOne({ where: { ci } });

  if (!expediente) {
    return res.status(404).json({ msg: "Este Expediente no existe, revise su CI"});
  }

  expediente.nombre_estudiante =
    req.body.nombre_estudiante || expediente.nombre_estudiante;
  expediente.apellido_estudiante =
    req.body.apellido_estudiante || expediente.apellido_estudiante;
  expediente.direccion_estudiante =
    req.body.direccion_estudiante || expediente.direcion_estudiante;
  expediente.telefono_estudiante =
    req.body.telefono_estudiante || expediente.telefono_estudiante;
  expediente.promedio = req.body.promedio || expediente.promedio;
  expediente.ci = req.body.ci || expediente.ci;
  const existe = await Expediente.findOne({ where: { ci: expediente.ci } });
  if (expediente.ci !== ci) {
    if (existe) {
      return res.status(404).json({ msg: "Este expediente ya exite, revise su CI" });
    }
  }

  try {
    await expediente.save();

    res.json({ msg: "Se ah actualizado Correctamente", expediente });
  } catch (error) {
    const err = new Error("Error al actualizar expediente");
    return res.status(500).json({ msg: err.message });
  }
};

export {
  crearExpediente,
  listarExpediente,
  listarExpedientes,
  actualizarExpediente,
  actualizarExpedienteProfesor,
};
