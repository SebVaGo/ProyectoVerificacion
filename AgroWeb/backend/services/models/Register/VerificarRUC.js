const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/database');
const Empresa = require('./Empresa');

const VerificarRUC = sequelize.define('VerificarRUC', {
    id_verificacion_ruc: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_empresa: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Empresa,
            key: 'id_empresa',
        },
    },
    codigo: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    tipo_codigo: {
        type: DataTypes.ENUM('Registro', 'Recuperacion'),
        allowNull: false,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    utilizado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    fecha_expiracion: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'VerificarRUC',
    timestamps: false,
});

VerificarRUC.belongsTo(Empresa, { foreignKey: 'id_empresa' });

module.exports = VerificarRUC;
