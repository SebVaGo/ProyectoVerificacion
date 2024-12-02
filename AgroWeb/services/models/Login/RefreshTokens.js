const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/database');
const Usuario = require('../Register/Usuario'); // Asegúrate de que la ruta a tu modelo Usuario sea correcta

const RefreshToken = sequelize.define('RefreshToken', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario',
        },
        onDelete: 'CASCADE',
    },
    token: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    is_valid: {
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
    tableName: 'RefreshTokens',
    timestamps: false,
});

RefreshToken.belongsTo(Usuario, { foreignKey: 'user_id' });

module.exports = RefreshToken;
