import { DataTypes } from "sequelize";
import db from "../config/db.js";
const UsuarioExpediente = db.define('usuarioexpediente', {
  id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
          model: 'Usuario', 
          key: 'id_usuario'
      }
  },
  id_expediente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
          model: 'Expediente', 
          key: 'id_expediente'
      }
  }
}, {
  timestamps: false,
  tableName: 'usuarioexpediente'
  
});
export default UsuarioExpediente;
