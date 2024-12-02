const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/database');
const TipoUsuario = require('./TipoUsuario');

const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    dni_ruc: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    correo: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    clave: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    id_tipo_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoUsuario,
            key: 'id_tipo_usuario',
        },
    },
    foto_perfil: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    estado_verificacion: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    primer_login: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'Usuarios',
    timestamps: false,
});

// Relación con TipoUsuario
Usuario.belongsTo(TipoUsuario, { foreignKey: 'id_tipo_usuario' });

// Relación con Direccion (diferido para evitar dependencias circulares)
Usuario.associate = (models) => {
    Usuario.hasOne(models.Direccion, { foreignKey: 'id_usuario', as: 'Direccion' });
};

module.exports = Usuario;
