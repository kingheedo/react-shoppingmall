import { Model,DataTypes } from 'sequelize'
import { dbTtype } from '.';
import {sequelize} from './sequelize'

class Payment extends Model{
    public readonly id! : number;
    public readonly orderId!: string;
    public readonly paymentKey!: string;
    public readonly paymentType!: 'NORMAL' | 'BRANDPAY' | 'KEYIN';\
    public readonly address!: string;
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
        db.Payment.hasMany(db.Address);

    }
    export default Payment