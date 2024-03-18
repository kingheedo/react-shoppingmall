import { Model,DataTypes } from 'sequelize';
import { dbTtype } from '.';
import {sequelize} from './sequelize'

class Image extends Model{
    public readonly id! : number;
    public src! : string;
    public readonly createdAt! : Date;
    public readonly updatedAt! : Date;
}
Image.init({
    src: {
        type : DataTypes.STRING(200),
        allowNull : true,
    },
},{
    modelName: 'Image',
    tableName: 'images',
    charset: 'utf8',
    collate: 'utf8_general_ci', 
    sequelize,   
})
export const associate = (db:dbTtype) =>{
    db.Image.belongsTo(db.Product);
}
Image.sync();
export default Image;