"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class Size extends sequelize_1.Model {
}
Size.init({
    option: {
        type: sequelize_1.DataTypes.STRING(2),
        allowNull: false,
    },
}, {
    modelName: 'Size',
    tableName: 'sizes',
    charset: 'utf8',
    collate: 'utf8_general_ci',
    sequelize: sequelize_2.sequelize,
});
const associate = (db) => {
    db.Size.belongsTo(db.Product);
};
exports.associate = associate;
exports.default = Size;
