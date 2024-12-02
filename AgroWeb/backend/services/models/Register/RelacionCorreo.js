const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/database');
const Usuario = require('./Usuario');
const TipoUsuario = require('./TipoUsuario');

const RelacionesCorreos = sequelize.define('RelacionesCorreos', {
    id_relacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    correo: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    dni_ruc: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
            model: Usuario,
            key: 'dni_ruc',
        },
    },
    id_tipo_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoUsuario,
            key: 'id_tipo_usuario',
        },
    },
}, {
    tableName: 'Relaciones_Correos',
    timestamps: false,
});

RelacionesCorreos.belongsTo(Usuario, { foreignKey: 'dni_ruc', targetKey: 'dni_ruc' });
RelacionesCorreos.belongsTo(TipoUsuario, { foreignKey: 'id_tipo_usuario' });

module.exports = RelacionesCorreos;
