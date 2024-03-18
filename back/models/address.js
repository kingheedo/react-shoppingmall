"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class Address extends sequelize_1.Model {
}
Address.init({
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
    }
}, {
    sequelize: sequelize_2.sequelize,
    modelName: 'Address',
    tableName: 'addresses',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});
const associate = (db) => {
    db.Address.belongsTo(db.User);
};
exports.associate = associate;
exports.default = Address;
