const { INTEGER, DECIMAL } = require('sequelize');
const DataTypes = require('sequelize');
const {Model} =  DataTypes;

module.exports = class HistoryCart extends Model{
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
            modelName: 'HistoryCart',
            tableName: 'historyCarts',
            charset: 'utf8',
            collate: 'utf8_general_ci', 
            sequelize,   
        })
    }
    static associate (db){
        db.HistoryCart.belongsTo(db.Product)
        db.HistoryCart.belongsTo(db.User)
        db.HistoryCart.belongsToMany(db.User,{through: {model: db.Payment, unique : false }})
    }
}