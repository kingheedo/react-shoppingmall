import { Model,DataTypes } from 'sequelize'
import { dbTtype } from '.';
import {sequelize} from './sequelize'

class Payment extends Model{
    public readonly id! : number;
    public readonly orderId!: string;
    public readonly paymentKey!: string;
    public readonly paymentType!: 'NORMAL' | 'BRANDPAY' | 'KEYIN';
    public readonly rcName!: string;
    public readonly rcPhone!: string;
    public readonly rcPostNum!: string;
    public readonly rcPostBase!: string;
    public readonly rcPostDetail!: string;
    public readonly isReviewed!: boolean;
    public readonly createdAt! : Date;
    public readonly updatedAt! : Date;
}   
    Payment.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            orderId: {
                type: DataTypes.STRING,
                allowNull: false
            },
            paymentKey: {
                type: DataTypes.STRING,
                allowNull: false
            },
            paymentType: {
                type: DataTypes.ENUM('NORMAL','BRANDPAY','KEYIN'),
                allowNull: false,
                defaultValue: ''
            },
            rcName: {
                type: DataTypes.STRING(20),
                allowNull:false
            },
            rcPhone: {
                type: DataTypes.STRING(11),
                allowNull:false
            },
            rcPostNum: {
                type: DataTypes.STRING(5),
                allowNull:false
            },
            rcPostBase:{ 
                type: DataTypes.STRING(100),
                allowNull: false
            },
            rcPostDetail: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            isReviewed: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            }
        },{
            modelName: 'Payment',
            tableName: 'payments',
            charset: 'utf8',
            collate: 'utf8_general_ci', 
            sequelize,   
        })
    export const associate = (db:dbTtype) =>{
        db.Payment.belongsTo(db.HistoryCart);
        db.Payment.belongsTo(db.User);
    }
    export default Payment