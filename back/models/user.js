"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class User extends sequelize_1.Model {
}
User.init({
    email: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: false,
        unique: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    sequelize: sequelize_2.sequelize,
    modelName: 'User',
    tableName: 'users',
    charset: 'utf8',
    collate: 'utf8_general_ci',
});
const associate = (db) => {
    db.User.hasMany(db.Product);
    db.User.hasMany(db.Review);
    db.User.belongsToMany(db.Product, { through: 'Like', as: 'Liked' });
    db.User.belongsToMany(db.Product, { through: { model: db.Cart, unique: false } });
    db.User.belongsToMany(db.Product, { through: { model: db.HistoryCart, unique: false } });
    db.User.belongsToMany(db.HistoryCart, { through: { model: db.Payment, unique: false } });
};
exports.associate = associate;
exports.default = User;
