const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/database');

const Categoria = sequelize.define('Categoria', {
    id_categoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_categoria: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    tableName: 'Categorias',
    timestamps: false,
});

module.exports = Categoria;
