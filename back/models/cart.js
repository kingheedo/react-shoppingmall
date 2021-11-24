const { INTEGER, DECIMAL } = require('sequelize');
const DataTypes = require('sequelize');
const {Model} =  DataTypes;

module.exports = class Cart extends Model{
    static init(sequelize){
        return super.init({
            id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
        },

        },{
            modelName: 'Cart',
            tableName: 'carts',
            charset: 'utf8',
            collate: 'utf8_general_ci', 
            sequelize,   
        })
    }
    static associate(db){
        db.Cart.hasMany(db.Product)
        db.Cart.belongsTo(db.User)

    }
}