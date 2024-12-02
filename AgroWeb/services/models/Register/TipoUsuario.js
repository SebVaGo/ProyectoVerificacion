const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/database');

const TipoUsuario = sequelize.define('TipoUsuario', {
    id_tipo_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tipo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'Tipo_Usuario',
    timestamps: false,
});

module.exports = TipoUsuario;
