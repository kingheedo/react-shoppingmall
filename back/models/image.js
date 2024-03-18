"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class Image extends sequelize_1.Model {
}
Image.init({
    src: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: true,
    },
}, {
    modelName: 'Image',
    tableName: 'images',
    charset: 'utf8',
    collate: 'utf8_general_ci',
    sequelize: sequelize_2.sequelize,
});
const associate = (db) => {
    db.Image.belongsTo(db.Product);
};
exports.associate = associate;
Image.sync();
exports.default = Image;
