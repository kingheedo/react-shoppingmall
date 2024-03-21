"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associate = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
class Product extends sequelize_1.Model {
}
Product.init({
    productName: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    stock: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    sex: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: sequelize_2.sequelize,
    modelName: 'Product',
    tableName: 'products',
    charset: 'utf8',
    collate: 'utf8_general_ci',
});
const associate = (db) => {
    db.Product.belongsTo(db.User);
    db.Product.hasMany(db.Size);
    db.Product.hasMany(db.Image);
    db.Product.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
    db.Product.belongsToMany(db.User, { through: { model: db.Cart, unique: false } });
    db.Product.belongsToMany(db.User, { through: { model: db.HistoryCart, unique: false } });
    db.Product.belongsToMany(db.User, { through: { model: db.Review, unique: false } });
};
exports.associate = associate;
exports.default = Product;
