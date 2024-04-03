import BoletaMovimiento from "../models/BoletaMovimiento.js";
import UsuarioBoletaMovimiento from "../models/UsuarioBoletaMovimiento.js";
const crearBoletaMovimiento = async (req, res) => {
  const { ci } = req.body;
  const { usuario } = req;
  // Verificando que solo la secretaria pueda crear expedientes
  if (usuario.tipo_usuario !== "Secretaria") {
    const error = new Error("No tienes acceso a esta funcionalidad");
    return res.status(403).json({ msg: error.message });
  }
  // Verificando si la Boleta Existe
  const boletaExiste = await BoletaMovimiento.findOne({ where: { ci } });

  if (boletaExiste) {
    const error = new Error("Esta Boleta ya exite, verifique su CI");
    return res.status(404).json({ msg: error.message });
  }

  try {
    // Guardar un Boleta
    const boleta = await BoletaMovimiento.create(req.body);
    // Crear una entrada en la tabla UsuarioBoletaMovimiento para conectar el expediente con la Secretaria (N-N)
    await UsuarioBoletaMovimiento.create({
      id_usuario: usuario.id_usuario,
      id_boleta: boleta.id_boleta,
    });
    return res.json({
      msg: `Boleta del estudiante ${boleta.nombre_estudiante} fue creada correctamente`,
    });
  } catch (error) {
    const err = new Error("Error al Crear una nueva boleta");
    return res.status(500).json({ msg: err.message });
  }
};

const listarBoletasMovimiento = async (req, res) => {
  const { usuario } = req;
  if (usuario.tipo_usuario !== "Secretaria") {
    const error = new Error("No tienes acceso a esta funcionalidad");
    return res.status(403).json({ msg: error.message });
  }
  try {
    // Obtener el id_usuario de la Secretaria desde el objeto usuario en req
    const id_usuario = usuario.id_usuario;

    // Buscar todas las entradas en UsuarioBoletaMovimiento que coincidan con el id_usuario de la Secretaria
    const usuarioBoletas = await UsuarioBoletaMovimiento.findAll({
      where: { id_usuario },
    });
    // Extraer los id_boleta de las entradas encontradas
    const id_boletas = usuarioBoletas.map((boleta) => boleta.id_boleta);
    // Buscar los detalles de los boletas en movimiento correspondientes
    const boletas = await BoletaMovimiento.findAll({
      where: { id_boleta: id_boletas },
    });

    // Responder con los Boletas en movimiento encontradas
    res.json(boletas);
  } catch (error) {
    const err = new Error("Error al listar los Boletas");
    return res.status(500).json({ msg: err.message });
  }
};

const listarBoleta = async (req, res) => {
  const { ci } = req.params;
  const { usuario } = req;
  const id_usuario = usuario.id_usuario;

  if (usuario.tipo_usuario !== "Secretaria") {
    const error = new Error("No tienes acceso a esta funcionalidad");
    return res.status(403).json({ msg: error.message });
  }
  try {
    // Buscar todas las entradas en UsuarioBoletaMovimiento que coincidan con el id_usuario de la Secretaria
    const usuarioBoletas = await UsuarioBoletaMovimiento.findAll({
      where: { id_usuario },
    });
    // Extraer los id_boleta de las entradas encontradas
    const id_boletas = usuarioBoletas.map((boleta) => boleta.id_boleta);
    // Buscar los detalles de los Boletas correspondientes
    const boletas = await BoletaMovimiento.findAll({
      where: { id_boleta: id_boletas },
    });
    const boletaEncontrada = boletas.find((boleta) => boleta.ci === ci);
     res.json(boletaEncontrada.reverse());
  } catch (error) {
    const err = new Error("Error al listar el Boleta");
    return res.status(500).json({ msg: err.message });
  }
};

const actualizarBoletaMovimiento = async (req, res) => {
  const { ci } = req.params;
  const { usuario } = req;

  //Verificando que el usuario que acceda solo sea de tipo Secretaria
  if (usuario.tipo_usuario !== "Secretaria") {
    const error = new Error("No tienes acceso a esta funcionalidad");
    return res.status(403).json({ msg: error.message });
  }
  //Se encuenta  la boleta por su Ci si exite
  const boleta = await BoletaMovimiento.findOne({ where: { ci } });
  //Si no existe se devuelve este respuesta
  if (!boleta) {
    const error = new Error("Esta boleta no existe");
    return res.status(404).json({ msg: error.message });
  }
  // Modificando valores de los campos pasados por req.body
  boleta.nombre_estudiante =
    req.body.nombre_estudiante || boleta.nombre_estudiante;
  boleta.nombre_tutor =
    req.body.nombre_tutor || boleta.nombre_tutor;
  boleta.telefono_estudiante =
    req.body.telefono_estudiante || boleta.telefono_estudiante;
  boleta.fecha = req.body.fecha || boleta.fecha;
  boleta.escuela_actual =
    req.body.escuela_actual || boleta.escuela_actual;
    boleta.escuela_traslado =
    req.body.escuela_traslado || boleta.escuela_traslado;
    boleta.motivo_traslado =
    req.body.motivo_traslado || boleta.motivo_traslado;
  boleta.ci = req.body.ci || boleta.ci;
  const existe = await BoletaMovimiento.findOne({ where: { ci: boleta.ci } });
  if (boleta.ci !== ci) {
    if (existe) {
      const error = new Error(
        "Este boleta en movimiento ya exite, intente verificar su CI"
      );
      return res.status(404).json({ msg: error.message });
    }
  }

  try {
    await boleta.save();

    res.json({ msg: "Se ah actualizado Correctamente la boleta",boleta });
  } catch (error) {
    const err = new Error("Error al actualizar boleta");
  }
}; 

export {
  crearBoletaMovimiento,
  listarBoleta,
  listarBoletasMovimiento,
  actualizarBoletaMovimiento,
};
