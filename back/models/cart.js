const { INTEGER, DECIMAL } = require('sequelize');
const DataTypes = require('sequelize');
const {Model} =  DataTypes;

module.exports = class Cart extends Model{
    static init(sequelize){
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
           quantity : {
                type : DataTypes.INTEGER,
                allowNull : true,
            },
            totalPrice: {
                type : DataTypes.INTEGER,
                allowNull : true,
            },
            size : {
                type : DataTypes.STRING(2),
                allowNull : false,
            },
        },{
            modelName: 'Cart',
            tableName: 'carts',
            charset: 'utf8',
            collate: 'utf8_general_ci', 
            sequelize,   
        })
    }
    static associate (db){
        db.Cart.belongsTo(db.Product)
        db.Cart.belongsTo(db.User)
    }
}