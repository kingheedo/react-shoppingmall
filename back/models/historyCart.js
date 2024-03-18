"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class HistoryCart extends sequelize_1.Model {
}
HistoryCart.init({
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
    modelName: 'HistoryCart',
    tableName: 'historyCarts',
    charset: 'utf8',
    collate: 'utf8_general_ci',
});
const associate = (db) => {
    db.HistoryCart.belongsTo(db.Product);
    db.HistoryCart.belongsTo(db.User);
    db.HistoryCart.belongsToMany(db.User, { through: { model: db.Payment, unique: false } });
};
exports.associate = associate;
HistoryCart.sync();
exports.default = HistoryCart;
