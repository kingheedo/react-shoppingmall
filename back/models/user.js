"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class User extends sequelize_1.Model {
}
User.init({
    level: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    email: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: true,
        unique: true,
        defaultValue: null
    },
    name: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: false,
        unique: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null
    },
    provider: {
        type: sequelize_1.DataTypes.ENUM('local', 'kakao', 'naver'),
        allowNull: false,
        defaultValue: 'local'
    },
    kakaoId: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true
    },
    naverId: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true
    },
    addressId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    }
}, {
    sequelize: sequelize_2.sequelize,
    modelName: 'User',
    tableName: 'users',
    charset: 'utf8',
    collate: 'utf8_general_ci',
});
const associate = (db) => {
    db.User.hasMany(db.Address);
    db.User.hasMany(db.Product);
    db.User.belongsToMany(db.Product, { through: 'Like', as: 'Liked' });
    db.User.belongsToMany(db.Product, { through: { model: db.Cart, unique: false } });
    db.User.belongsToMany(db.Product, { through: { model: db.HistoryCart, unique: false } });
    db.User.belongsToMany(db.Product, { through: { model: db.Review, unique: true } });
    db.User.belongsToMany(db.HistoryCart, { through: { model: db.Payment, unique: false } });
};
exports.associate = associate;
User.sync();
exports.default = User;
