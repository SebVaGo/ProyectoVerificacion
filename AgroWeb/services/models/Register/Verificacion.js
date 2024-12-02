const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/database');
const Usuario = require('./Usuario');

const Verificacion = sequelize.define('Verificacion', {
    id_verificacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario',
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
}, {
    tableName: 'Verificacion',
    timestamps: false,
});

Verificacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });

module.exports = Verificacion;
