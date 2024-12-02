const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/database');
const Item = require('./Item'); // Ya lo importaste directamente
const Usuario = require('../Register/Usuario'); // También importas Usuario directamente
const Medida = require('./Medida'); // Importa el nuevo modelo de Medida

const Producto = sequelize.define('Producto', {
    id_producto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_item: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Item, // Usamos la referencia directa
            key: 'id_item',
        },
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    imagen_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario, // Usamos la referencia directa
            key: 'id_usuario',
        },
        onDelete: 'CASCADE',
    },
    id_medida: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Medida, // Usamos la referencia directa al modelo de Medida
            key: 'id_medida',
        },
    },
}, {
    tableName: 'Productos',
    timestamps: false,
});

// Definir las relaciones directamente sin usar models
Producto.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'Usuario' });
Producto.belongsTo(Item, { foreignKey: 'id_item', as: 'Item' });
Producto.belongsTo(Medida, { foreignKey: 'id_medida', as: 'Medida' }); // Relación con Medida

module.exports = Producto;
