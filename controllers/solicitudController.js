import Expediente from "../models/Expediente.js";
import Solicitud from "../models/Solicitud.js";
import UsuarioExpediente from "../models/UsuarioExpediente.js";
import UsuarioSolicitud from "../models/UsuarioSolicitud.js";
const crearSolicitud = async (req, res) => {
  const { usuario } = req;
  const{tipo_usuario,id_usuario,nombre}=usuario;
  const solicitud = req.body;
  const { tipo_solicitud, descripcion, ci, nombre_estudiante } = solicitud;

  if (tipo_usuario === "Tutor") {
    if (tipo_solicitud === "Traslado") {
      try {
        const expediente = await Expediente.findOne({ where: { ci } });
        if (!expediente) {
          return res.status(403).json({
            msg: "La solicitud no se puede procesar, el estudiante no existe",
          });
        }
        const existeSolicitud = await Solicitud.findOne({
          where: {id_expediente:expediente.id_expediente}})
        if(existeSolicitud){
          return res.status(200).json({msg:"Ya esta solicitud ha sido enviada y se esta procesando"});
        }

        const solicitud = await Solicitud.create({
          tipo_solicitud,
          descripcion:`Envio esta solicitud debido a : ${descripcion}. Soy ${nombre} el ${tipo_usuario} de ${nombre_estudiante}`,
          id_expediente: expediente.id_expediente,
        });

        await UsuarioSolicitud.create({
          id_usuario,
          id_solicitud: solicitud.id_solicitud,
        });
        return res.json({
          msg: "Su solicitud esta proceso, espere a que la Secretaria atienda su Solicitud",
        });
      } catch (error) {
        const err = new Error("Hubo un error al procesar su solicitud");
        return res.status(500).json({ msg: err.message });
      }
    } 
     if (tipo_solicitud === "Registro") {
      try {
        //const solicitudUsuario = await UsuarioSolicitud.findOne({
        //  where: {id_usuario}});
        //  if(solicitudUsuario){
        //const solicitudExiste = await Solicitud.findOne({
        //  where:{id_solicitud:solicitudUsuario.id_solicitud}
        //})
        //  if(solicitudExiste){
        //    return res.status(200).json({msg:"Ya esta solicitud ha sido enviada y se esta procesando"});
        //  }
        //}
        const solicitud = await Solicitud.create({
          tipo_solicitud,
          descripcion:`Envio esta solicitud debido a : ${descripcion}. Soy ${nombre} el ${tipo_usuario} de ${nombre_estudiante}`,
        });
        await UsuarioSolicitud.create({
          id_usuario,
          id_solicitud: solicitud.id_solicitud,
        });
        return res.json({
          msg: "Su solicitud esta proceso, espere a que la Secretaria atienda su Solicitud ",
        });
      } catch (error) {
        const err = new Error("Hubo un error en procesar su solicitud");
        return res.status(500).json({ msg: err.message });
      }
    }
    return res.status(403).json({
      msg: `No puedes realizar solicitudes de tipo ${tipo_solicitud}`,
    });
  }

     if(tipo_usuario==='Profesor') { 
    try {
      const expediente = await Expediente.findOne({ where: { ci } });
      if (!expediente) {
        return res.status(403).json({
          msg: `La solicitud no se puede procesar, el expediente del estudiante ${nombre_estudiante} no existe`,
        });
      }
      
      const existeSolicitud = await Solicitud.findOne({
        where: {id_expediente:expediente.id_expediente, tipo_solicitud:'Expediente'}})
      if(existeSolicitud){
        return res.status(200).json({msg:"Ya esta solicitud ha sido enviada y se esta procesando"})
      }

     const solicitud =  await Solicitud.create({
        tipo_solicitud,
        descripcion:` Envio esta solicitud debido a : ${descripcion}. Soy ${nombre} el ${tipo_usuario} de ${nombre_estudiante} `,
        id_expediente: expediente.id_expediente,
      });
      await UsuarioSolicitud.create({
        id_usuario: usuario.id_usuario,
        id_solicitud: solicitud.id_solicitud,
      });
      return res.json({
        msg: "Su solicitud esta proceso, espere a que la Secretaria atienda su Solicitud ",
      });
    } catch (error) {
      const err = new Error("Hubo un error en procesar su solicitud");
      return res.status(500).json({ msg: err.message });
    }}
};
const listarSolicitudes = async (req, res) => {
  const { usuario } = req;
  const { tipo_usuario, id_usuario } = usuario;
  if (tipo_usuario === "Secretaria") {
    try {
      // Buscar todas las entradas en UsuarioExpediente que coincidan con el id_usuario de la Secretaria
      const usuarioExpedientes = await UsuarioExpediente.findAll({
        where: { id_usuario },
      });
      // Extraer los id_expediente de las entradas encontradas
      const id_expediente = usuarioExpedientes.map(
        (expediente) => expediente.id_expediente
      );
      //Buscar todas las entradas en Solicitud que concidan con los id_expedientes que fueron creados por esa Secretaria sea Traslado o Expediente
      const solicitudExpedientes = await Solicitud.findAll({
        where: { id_expediente },
      });
      //todas las solicitudes de tipo Registro
      const solicitudesR = await Solicitud.findAll({
        where: {
          tipo_solicitud: "Registro",
        },
      });

      const todasSolicitudes = [...solicitudExpedientes, ...solicitudesR];
      if (todasSolicitudes.length === 0) {
        // Enviar una respuesta indicando que no hay ninguna solicitud vigente
        return res.status(200).json({ msg: "No hay ninguna solicitud vigente" });
      }
      // Enviar el arreglo combinado como respuesta
      return res.json(todasSolicitudes);
    } catch (error) {
      const err = new Error("Error al listar las Solicitudes");
      return res.status(500).json({ msg: err.message });
    }
  }

  try {
    // Buscar todas las entradas en UsuarioSolicitud que coincidan con el id_usuario de la Profesor o Tutor que las Creo
    const usuarioSolicitud = await UsuarioSolicitud.findAll({
      where: { id_usuario },
    });
    // Extraer los id_solicitud de las entradas encontradas
    const id_solicitud = usuarioSolicitud.map(
      (solicitud) => solicitud.id_solicitud
    );
    // Verificar si el arreglo está vacío
    if (id_solicitud.length === 0) {
      // Enviar una respuesta indicando que no hay ninguna solicitud vigente
      return res.status(200).json({ msg: "No hay ninguna solicitud vigente" });
    }
    const solicitudes = await Solicitud.findAll({
      where: { id_solicitud },
    });
    
    res.json(solicitudes);
  } catch (error) {
    const err = new Error("Error al listar las Solicitudes");
    return res.status(500).json({ msg: err.message });
  }
};

const confirmarSolicitudes = async (req, res) => {
  const { usuario } = req;
  const { id, respuesta } = req.params;

  const esAprobada = respuesta === 'true';
 
  const mensaje = esAprobada ? "Aprobada" : "Denegada";  if (usuario.tipo_usuario !== "Secretaria") {
    return res
      .status(403)
      .json({ msg: "No tienes acceso a esta funcionalidad" });
  }
  const solicitud = await Solicitud.findOne({ where: { id_solicitud:id } });
  if (!solicitud) {
    const error = new Error("Esta solicitud no exite");
    return res.status(404).json({ msg: error.message });
  }

  try {
    
    solicitud.confirmado = esAprobada;
    await solicitud.save();
    
    res.json({ msg: `La solicitud fue ${mensaje} de manera exitosa` });
  } catch (error) {
    const err = new Error("Error al Confirmar la Solicitud");
    return res.status(500).json({ msg: err.message });
  }
};

export { crearSolicitud, listarSolicitudes, confirmarSolicitudes };
