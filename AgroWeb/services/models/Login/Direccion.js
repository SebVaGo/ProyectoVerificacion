const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/database');

// Importar el modelo dentro de una función o más tarde para evitar ciclos circulares
const Direccion = sequelize.define('Direccion', {
    id_direccion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuarios', // No utilizar el modelo directamente aquí para evitar el ciclo
            key: 'id_usuario',
        },
        onDelete: 'CASCADE',
    },
    pais: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    departamento: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    provincia: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    distrito: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    direccion_detallada: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    tableName: 'Direcciones',
    timestamps: false,
});

// Definir la relación de manera diferida para evitar el ciclo circular
Direccion.associate = (models) => {
    Direccion.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'Usuario' });
};

module.exports = Direccion;
