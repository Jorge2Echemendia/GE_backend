import { DataTypes } from "sequelize";
import db from "../config/db.js";
const UsuarioSolicitud = db.define("usuariosolicitud", {
  id_solicitud: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references:{
      model:'Solicitud',
      key:'id_solicitud'
    }
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Usuario', 
      key: 'id_usuario'
  }
  }
}, {
  timestamps: false,
  tableName: 'usuariosolicitud'
  
});
export default UsuarioSolicitud;
