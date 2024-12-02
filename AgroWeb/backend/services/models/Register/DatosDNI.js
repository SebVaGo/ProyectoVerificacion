const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/database');

const DatosDNI = sequelize.define('DatosDNI', {
    id_datos_dni: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    dni: {
        type: DataTypes.STRING(8),
        allowNull: false,
        unique: true,
    },
    primer_nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    segundo_nombre: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    apellido_paterno: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    apellido_materno: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    fecha_actualizacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'DatosDNI',
    timestamps: false,
});

module.exports = DatosDNI;
