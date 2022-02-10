const { INTEGER, DECIMAL } = require('sequelize');
const DataTypes = require('sequelize');
const {Model} =  DataTypes;

module.exports = class RecordCart extends Model{
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
            modelName: 'RecordCart',
            tableName: 'recordCarts',
            charset: 'utf8',
            collate: 'utf8_general_ci', 
            sequelize,   
        })
    }
    static associate (db){
        db.RecordCart.belongsTo(db.Product)
        db.RecordCart.belongsTo(db.User)
        db.RecordCart.belongsToMany(db.User,{through: {model: db.Payment, unique : false }})
    }
}