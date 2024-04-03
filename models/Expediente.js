import { DataTypes } from "sequelize";
import db from "../config/db.js";
const Expediente = db.define("expedientes", {
  id_expediente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_estudiante: {
    type: DataTypes.STRING,
  },
  apellido_estudiante: { 
    type: DataTypes.STRING 
},
  direccion_estudiante: {
    type: DataTypes.STRING,
  },
  telefono_estudiante: { 
    type: DataTypes.STRING
 },
  promedio: {
    type: DataTypes.FLOAT,
  }, ci: {
    type: DataTypes.STRING,
    allowNull: false, // Opcional: Asegura que el campo no puede ser nulo
 },
});


export default Expediente;
