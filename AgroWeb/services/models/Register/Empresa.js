const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/database');

const Empresa = sequelize.define('Empresa', {
    id_empresa: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ruc: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: true,
    },
    razon_social: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    departamento: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    provincia: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    distrito: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    estado: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    condicion: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    fecha_actualizacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'Empresa',
    timestamps: false,
});

module.exports = Empresa;
