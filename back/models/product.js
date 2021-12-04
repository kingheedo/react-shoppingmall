const DataTypes = require('sequelize');
const {Model} =  DataTypes;

module.exports = class Product extends Model{
    static init(sequelize){
        return super.init({
            name : {
                type : DataTypes.STRING(50),
                allowNull : false,
                unique: true,
            },
            price : {
                type : DataTypes.DECIMAL,
                allowNull : false,
            },
            size : {
                type : DataTypes.ENUM('XS','S','M','L'),
                allowNull : true,
            },
            stock: {
                type : DataTypes.INTEGER,
                allowNull : false,
            },
            star: {
                type : DataTypes.INTEGER,
                allowNull : false,
            },
            deliveryFee : {
                type : DataTypes.DECIMAL,
                allowNull : false,
            },

        },{
            modelName: 'Product',
            tableName: 'products',
            charset: 'utf8',
            collate: 'utf8_general_ci', 
            sequelize,   
        })
    }
    static associate(db){
        db.Product.hasMany(db.Review);
        db.Product.belongsToMany(db.User, {through : 'Like', as: 'Likers'})
        db.Product.belongsToMany(db.User, {through: db.Cart})


    }
}