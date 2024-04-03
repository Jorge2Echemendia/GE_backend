import express from "express";

import checkAuth from "../middleware/authMiddleware.js";
import { actualizarBoletaMovimiento, crearBoletaMovimiento, listarBoleta, listarBoletasMovimiento } from "../controllers/boletaMovimientoController.js";
import ciVerificar from "../middleware/ciMiddleware.js";

const router = express.Router();


//Area Privada
router.post('/crear-boleta', checkAuth, ciVerificar,crearBoletaMovimiento );
router.get('/listar-boletas', checkAuth,listarBoletasMovimiento);
router.get('/listar-boleta/:ci', checkAuth,listarBoleta);
router.put('/actualizar-boleta/:ci',checkAuth,actualizarBoletaMovimiento);


export default router;