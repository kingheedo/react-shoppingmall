"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class Cart extends sequelize_1.Model {
}
Cart.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    totalPrice: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    size: {
        type: sequelize_1.DataTypes.STRING(2),
        allowNull: false,
    },
}, {
    sequelize: sequelize_2.sequelize,
    modelName: 'Cart',
    tableName: 'carts',
    charset: 'utf8',
    collate: 'utf8_general_ci',
});
const associate = (db) => {
    db.Cart.belongsTo(db.Product);
    db.Cart.belongsTo(db.User);
};
exports.associate = associate;
Cart.sync();
exports.default = Cart;
