import {Model,DataTypes, BelongsToManyGetAssociationsMixin} from 'sequelize';
import { dbTtype } from '.';
import HistoryCart from './historyCart';
import {sequelize} from './sequelize'
class User extends Model{
    public readonly id!:number;
    public email!:string | null;
    public name!:string;
    public password!:string | null;
    public kakaoId!: string | null;
    public naverId!: string | null;
    public provider!: 'local' | 'kakao' | 'naver';
    public addressId!: number | null;
    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}
    User.init({
            level: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
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
                type: DataTypes.ENUM('local', 'kakao', 'naver'),
                allowNull: false,
                defaultValue: 'local'
            },
            kakaoId: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            naverId: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            addressId: {
                type: DataTypes.INTEGER,
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
        db.User.hasMany(db.Address);
        db.User.hasMany(db.Product);
        db.User.belongsToMany(db.Product, {through: 'Like', as :'Liked'});
        db.User.belongsToMany(db.Product, {through: {model: db.Cart,unique: false }});
        db.User.belongsToMany(db.Product, {through: {model: db.HistoryCart,unique: false }});
        db.User.belongsToMany(db.Product, {through: {model: db.Review, unique: false}})
        db.User.belongsToMany(db.HistoryCart,{through: {model: db.Payment, unique : false}});
    }
    export default User;