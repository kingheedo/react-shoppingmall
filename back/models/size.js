const DataTypes = require('sequelize');
const {Model} =  DataTypes;

module.exports = class Size extends Model{
    static init(sequelize){
        return super.init({
            option : {
                type : DataTypes.STRING(2),
                allowNull : false,
            },
        },{
            modelName: 'Size',
            tableName: 'sizes',
            charset: 'utf8',
            collate: 'utf8_general_ci', 
            sequelize,   
        })
    }
     static associate(db){
        db.Size.belongsTo(db.Product)
    }
}