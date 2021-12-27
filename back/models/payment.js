const DataTypes = require('sequelize');
const {Model} =  DataTypes;

module.exports = class Payment extends Model{
    static init(sequelize){
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            cancelled: {
                type : DataTypes.BOOLEAN(),
                allowNull : false,
            },
            email:{
                type: DataTypes.STRING(200),
                allowNull : false,
            },
            paid: {
                type: DataTypes.BOOLEAN(),
                allowNull : false,
            },
            payerID: {
                type : DataTypes.STRING(100),
                allowNull : false,
            },
            paymentID: {
                type: DataTypes.STRING(100),
                allowNull : false,
            },
            paymentToken: {
                type: DataTypes.STRING(100),
                allowNull : false,
            },
            returnUrl : {
                type: DataTypes.STRING(300),
                allowNull : false,
            },
        },{
            modelName: 'Payment',
            tableName: 'payments',
            charset: 'utf8',
            collate: 'utf8_general_ci', 
            sequelize,   
        })
    }
    static associate(db){
        db.Payment.belongsTo(db.Cart)
        db.Payment.belongsTo(db.User)

    }
}