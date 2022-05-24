import { DataTypes, Model } from 'sequelize';
import { dbTtype } from '.';
import {sequelize} from './sequelize'
class Cart extends Model{
    public readonly id! : number;
    public quantity! : number;
    public totalPrice! : number;
    public size! : string;
    public readonly createdAt! : Date;
    public updatedAt! : Date;
    public UserId! : number;
    public ProductId! : number;
}
            Cart.init({
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
            modelName: 'Cart',
            tableName: 'carts',
            charset: 'utf8',
            collate: 'utf8_general_ci', 
               
    })
    export const associate =  (db:dbTtype) =>{
        db.Cart.belongsTo(db.Product)
        db.Cart.belongsTo(db.User)
    }
export default Cart