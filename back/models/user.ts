import {Model,DataTypes} from 'sequelize';
import { dbTtype } from '.';
import {sequelize} from './sequelize'
class User extends Model{
    public readonly id!:number;
    public email!:string;
    public name!:string;
    public password!:string;
    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}
    User.init({
            email: {
                type: DataTypes.STRING(30),
                allowNull : false,
                unique : true,
            },
            name: {
                type: DataTypes.STRING(30),
                allowNull : false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull : false,
            },
        },{
            sequelize,  
            modelName: 'User',
            tableName: 'users',
            charset: 'utf8',
            collate: 'utf8_general_ci', 
    })
    export const associate = (db:dbTtype) => {
        db.User.hasMany(db.Product)
        db.User.hasMany(db.Review)
        db.User.belongsToMany(db.Product, {through: 'Like', as :'Liked'})
        db.User.belongsToMany(db.Product, {through: {model: db.Cart,unique: false }})
        db.User.belongsToMany(db.Product, {through: {model: db.HistoryCart,unique: false }})
        db.User.belongsToMany(db.HistoryCart,{through: {model: db.Payment,unique : false}})
    }
    export default User;