import { DataTypes } from "sequelize";
import db from "../config/db.js";
const BoletaMovimiento = db.define("boletamovimiento", {
  id_boleta: {
     type: DataTypes.INTEGER,
      primaryKey: true, 
      autoIncrement: true
     },
  nombre_estudiante: {
    type: DataTypes.STRING,
  },
  nombre_tutor: {
    type: DataTypes.STRING,
  },
  telefono_estudiante: {
     type: DataTypes.STRING
     },
  fecha: {
    type: DataTypes.DATE,
  },
  escuela_actual: {
     type: DataTypes.STRING
     },
  escuela_traslado: {
    type: DataTypes.STRING,
  },
  motivo_traslado: { 
    type: DataTypes.STRING
 }, ci: { 
  type: DataTypes.STRING,
  allowNull: false, // Opcional: Asegura que el campo no puede ser nulo
},
});
export default BoletaMovimiento;
