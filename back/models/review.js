const DataTypes = require('sequelize');
const {Model} =  DataTypes;

module.exports = class Review extends Model{
    static init(sequelize){
        return super.init({
            content : {
                type : DataTypes.STRING(50),
                allowNull : false,
            },
            rate: {
                type : DataTypes.INTEGER,
                allowNull: false,
            },
            reviewUnique : { 
                type: DataTypes.STRING(200), 
                unique: true 
            }
        },{
            modelName: 'Review',
            tableName: 'reviews',
            charset: 'utf8',
            collate: 'utf8_general_ci', 
            sequelize,   
        })
    }
     static associate(db){
        db.Review.belongsTo(db.User)
        db.Review.belongsTo(db.Product)
    }
}