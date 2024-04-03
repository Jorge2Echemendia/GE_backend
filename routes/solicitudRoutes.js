import express from "express";

import checkAuth from "../middleware/authMiddleware.js";
import {  confirmarSolicitudes, crearSolicitud,  listarSolicitudes } from "../controllers/solicitudController.js";
import ciVerificar from "../middleware/ciMiddleware.js";

const router = express.Router();


//Area Privada
router.post('/crear-solicitud', checkAuth,crearSolicitud);
router.post('/crear-solicitud-registro',checkAuth,ciVerificar,crearSolicitud);
router.get('/listar-solicitudes', checkAuth,listarSolicitudes);
router.get('/confirmar-estado-solicitud/:id/:respuesta',checkAuth, confirmarSolicitudes);



export default router;