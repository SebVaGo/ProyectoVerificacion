const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/database');
const Usuario = require('./Usuario');

const RecuperacionContrasena = sequelize.define('RecuperacionContrasena', {
    id_recuperacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario',
        },
    },
    token: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    fecha_expiracion: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    utilizado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'Recuperacion_Contrasena',
    timestamps: false,
});

RecuperacionContrasena.belongsTo(Usuario, { foreignKey: 'id_usuario' });

module.exports = RecuperacionContrasena;
