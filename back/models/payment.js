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
    orderId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    paymentKey: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    paymentType: {
        type: sequelize_1.DataTypes.ENUM('NORMAL', 'BRANDPAY', 'KEYIN'),
        allowNull: false,
        defaultValue: ''
    },
    rcName: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    rcPhone: {
        type: sequelize_1.DataTypes.STRING(11),
        allowNull: false
    },
    rcPostNum: {
        type: sequelize_1.DataTypes.STRING(5),
        allowNull: false
    },
    rcPostBase: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    rcPostDetail: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true
    },
    isReviewed: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    }
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
