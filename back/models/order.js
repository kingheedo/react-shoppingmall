const DataTypes = require('sequelize');
const {Model} =  DataTypes;

module.exports = class Order extends Model{
    static init(sequelize){
        return super.init({
            id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
        },
        },{
            modelName: 'Order',
            tableName: 'orders',
            charset: 'utf8',
            collate: 'utf8_general_ci', 
            sequelize,   
        })
    }
    static associate(db){
        db.Order.hasMany(db.Product)
        db.Order.belongsTo(db.User)

    }
}