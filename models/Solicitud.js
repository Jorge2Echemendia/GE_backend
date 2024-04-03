import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Solicitud = db.define("solicitud", {
 id_solicitud: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
 },
 tipo_solicitud: {
    type: DataTypes.STRING,
    
 },
 descripcion: {
    type: DataTypes.STRING,
 },
 id_expediente: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Expediente', 
      key: 'id_expediente',
    },
 },
 confirmado: {
    type: DataTypes.BOOLEAN,
 },
}, {
 tableName: 'solicitud',
});

export default Solicitud;
