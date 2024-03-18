import { DataTypes, Model } from 'sequelize';
import { dbTtype } from '.';
import {sequelize} from './sequelize'

class Size extends Model{
    public readonly id! : number;
    public readonly option! : string;
    public readonly createdAt! : number;
    public readonly updatedAt! : number;
}
        Size.init({
            option : {
                type : DataTypes.STRING(2),
                allowNull : false,
            },
        },{
            modelName: 'Size',
            tableName: 'sizes',
            charset: 'utf8',
            collate: 'utf8_general_ci', 
            sequelize,   
        })
    
     export const associate = (db:dbTtype) =>{
        db.Size.belongsTo(db.Product)
    }
    Size.sync();
    export default Size;