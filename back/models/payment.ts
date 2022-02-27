import { Model,DataTypes } from 'sequelize'
import { dbTtype } from '.';
import {sequelize} from './sequelize'

class Payment extends Model{
    public readonly id! : number;
    public readonly cancelled! : boolean;
    public readonly email! : string;
    public readonly paid! : boolean;
    public readonly payerID! : string;
    public readonly paymentID! : string;
    public readonly paymentToken! : string;
    public readonly returnUrl! : string;
    public readonly createdAt! : Date;
    public readonly updatedAt! : Date;
}
    Payment.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            cancelled: {
                type : DataTypes.BOOLEAN,
                allowNull : false,
            },
            email:{
                type: DataTypes.STRING(200),
                allowNull : false,
            },
            paid: {
                type: DataTypes.BOOLEAN,
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
    export const associate = (db:dbTtype) =>{
        db.Payment.belongsTo(db.HistoryCart)
        db.Payment.belongsTo(db.User)

    }
    export default Payment