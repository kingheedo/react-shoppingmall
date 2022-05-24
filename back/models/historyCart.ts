import { BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, DataTypes, Model } from 'sequelize'
import { dbTtype } from '.';
import Payment from './payment';
import {sequelize} from './sequelize'
class HistoryCart extends Model{
    public readonly id! : number;
    public quantity! : number;
    public totalPrice! : number;
    public size! : string;
    public addPayments! : BelongsToManyAddAssociationsMixin<Payment,any>;
    public readonly createdAt! : Date;
    public readonly updatedAt! : Date;
}
    HistoryCart.init({
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
            sequelize, 
            modelName: 'HistoryCart',
            tableName: 'historyCarts',
            charset: 'utf8',
            collate: 'utf8_general_ci', 
        })
    export const associate =  (db:dbTtype) =>{
        db.HistoryCart.belongsTo(db.Product)
        db.HistoryCart.belongsTo(db.User)
        db.HistoryCart.belongsToMany(db.User,{through: {model: db.Payment, unique : false }})
    }
export default HistoryCart