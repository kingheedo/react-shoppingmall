const DataTypes = require('sequelize');
const {Model} =  DataTypes;

module.exports = class Product extends Model{
    static init(sequelize){
        return super.init({
            productName : {
                type : DataTypes.STRING(50),
                allowNull : false,
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
                allowNull : true,
            },
            deliveryFee : {
                type : DataTypes.DECIMAL,
                allowNull : true,
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
        db.Product.belongsTo(db.User)
        db.Product.hasMany(db.Image);
        db.Product.hasMany(db.Review);
        db.Product.belongsToMany(db.User, {through : 'Like', as: 'Likers'})
        db.Product.belongsToMany(db.User, {through: db.Cart})


    }
}