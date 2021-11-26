const { INTEGER, DECIMAL } = require('sequelize');
const DataTypes = require('sequelize');
const {Model} =  DataTypes;

module.exports = class Cart extends Model{
    static init(sequelize){
        return super.init({
           quantity : {
                type : DataTypes.INTEGER,
                allowNull : true,
            },
            pluralPrice: {
                type : DataTypes.DECIMAL,
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
}