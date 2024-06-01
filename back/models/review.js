"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class Review extends sequelize_1.Model {
}
Review.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    rate: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize: sequelize_2.sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
});
const associate = (db) => {
    db.Review.hasMany(db.ReviewImage);
    db.Review.belongsTo(db.User);
    db.Review.belongsTo(db.Product);
    db.Review.belongsTo(db.Payment);
};
exports.associate = associate;
exports.default = Review;
