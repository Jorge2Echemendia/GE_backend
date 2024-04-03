import express from "express";
import cors from "cors";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import expedienteRoutes from "./routes/expedienteRoutes.js";
import solicitudRoutes from "./routes/solicitudRoutes.js";
import boletaMovimientoRoutes from "./routes/boletaMovimientoRoutes.js"


import db from "./config/db.js";
import dotenv from "dotenv";

//Creando instancia de express
const app = express();
app.use(express.json());
dotenv.config();
// Prueba la conexión a la base de datos
db.authenticate()
  .then(() => console.log("Conexión a la base de datos establecida con éxito."))
  .catch((err) =>
    console.error("No se pudo conectar a la base de datos:", err)
  );
 const dominiosPermitidos = ["http://localhost:3000"];
  const corsOptions = {
    origin: function(origin, callback){
      if(dominiosPermitidos.indexOf(origin) !== -1){
        //El origen del Requet esta permitido
        callback(null,true);
    }else{
      callback(new Error('No permitido por CORS'))
    }
  }
  }
  app.use(cors(corsOptions));
  app.use("/api/usuario", usuarioRoutes);
  app.use("/api/expediente", expedienteRoutes);
  app.use("/api/solicitud",solicitudRoutes);
  app.use("/api/boletaMovimiento",boletaMovimientoRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
