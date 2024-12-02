const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/database');
const Categoria = require('./Categoria'); // Ya lo importaste directamente

const Item = sequelize.define('Item', {
    id_item: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_item: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Categoria, // Usamos la referencia directa
            key: 'id_categoria',
        },
    },
}, {
    tableName: 'Items',
    timestamps: false,
});

// Definir la relación directamente sin usar models
Item.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'Categoria' });



module.exports = Item;
