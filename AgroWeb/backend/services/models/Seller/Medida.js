const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/database');

const Medida = sequelize.define('Medida', {
    id_medida: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    tableName: 'Medidas',
    timestamps: false,
});

module.exports = Medida;
