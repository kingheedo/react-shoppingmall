const DataTypes = require('sequelize');
const {Model} =  DataTypes;

module.exports = class Review extends Model{
    static init(sequelize){
        return super.init({
            content : {
                type : DataTypes.STRING(50),
                allowNull : false,
            },
            src: {
                type : DataTypes.STRING(200),
                allowNull : true,
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
        db.Review.belongsTo(db.Post)
    }
}