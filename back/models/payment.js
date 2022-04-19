"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class Payment extends sequelize_1.Model {
}
Payment.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cancelled: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
    },
    paid: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    payerID: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    paymentID: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    paymentToken: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    returnUrl: {
        type: sequelize_1.DataTypes.STRING(300),
        allowNull: false,
    },
}, {
    modelName: 'Payment',
    tableName: 'payments',
    charset: 'utf8',
    collate: 'utf8_general_ci',
    sequelize: sequelize_2.sequelize,
});
const associate = (db) => {
    db.Payment.belongsTo(db.HistoryCart);
    db.Payment.belongsTo(db.User);
};
exports.associate = associate;
exports.default = Payment;
