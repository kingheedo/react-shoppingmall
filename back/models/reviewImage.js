"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class ReviewImage extends sequelize_1.Model {
}
ReviewImage.init({
    src: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
}, {
    modelName: 'ReviewImage',
    tableName: 'reviewImages',
    charset: 'utf8',
    collate: 'utf8_general_ci',
    sequelize: sequelize_2.sequelize,
});
const associate = (db) => {
    db.ReviewImage.belongsTo(db.Review);
};
exports.associate = associate;
ReviewImage.sync();
exports.default = ReviewImage;
