import { DataTypes } from "sequelize";
import db from "../config/db.js";
const UsuarioBoletaMovimiento = db.define("usuarioBoletaMovimientos", {
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'Usuario', 
            key: 'id_usuario'
        }
    },
    id_boleta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'BoletaMovimiento', 
            key: 'id_boleta'
        }
    }
  }, {
    timestamps: false,
    tableName: 'usuarioboletamovimientos'
    
  });
export default UsuarioBoletaMovimiento;
