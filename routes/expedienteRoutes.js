import express from "express";
import { actualizarExpediente, actualizarExpedienteProfesor, crearExpediente, listarExpediente, listarExpedientes } from "../controllers/expedienteController.js";
import checkAuth from "../middleware/authMiddleware.js";
import checkRequest from "../middleware/solicitudMiddleware.js";
import ciVerificar from "../middleware/ciMiddleware.js";

const router = express.Router();


//Area Privada
router.post('/crear-expediente', checkAuth,ciVerificar ,crearExpediente);
router.get('/listar-expedientes', checkAuth,listarExpedientes);
router.get('/listar-expediente/:ci', checkAuth,listarExpediente);
router.put('/actualizar-expediente/:ci',checkAuth,actualizarExpediente);
router.put('/actualizar-expediente-profesor/:ci',checkAuth, checkRequest , actualizarExpedienteProfesor);


export default router;
