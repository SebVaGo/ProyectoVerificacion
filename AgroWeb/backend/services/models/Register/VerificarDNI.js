const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/database');
const DatosDNI = require('./DatosDNI');

const VerificarDNI = sequelize.define('VerificarDNI', {
    id_verificacion_dni: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_datos_dni: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: DatosDNI,
            key: 'id_datos_dni',
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
    tableName: 'VerificarDNI',
    timestamps: false,
});

VerificarDNI.belongsTo(DatosDNI, { foreignKey: 'id_datos_dni' });

module.exports = VerificarDNI;
