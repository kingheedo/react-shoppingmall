import {Model,DataTypes, BelongsToManyGetAssociationsMixin} from 'sequelize';
import { dbTtype } from '.';
import HistoryCart from './historyCart';
import {sequelize} from './sequelize'
class User extends Model{
    public readonly id!:number;
    public email!:string | null;
    public name!:string;
    public password!:string | null;
    public kakaoId!: string | null
    public provider!: 'local' | 'kakao';
    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}
    User.init({
            email: {
                type: DataTypes.STRING(30),
                allowNull : true,
                unique : true,
                defaultValue: null
            },
            name: {
                type: DataTypes.STRING(30),
                allowNull : false,
                unique: false,
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull : true,
                defaultValue: null
            },
            provider: {
                type: DataTypes.ENUM('local', 'kakao'),
                allowNull: false,
                defaultValue: 'local'
            },
            kakaoId: {
                type: DataTypes.STRING(100),
                allowNull: true
            }
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