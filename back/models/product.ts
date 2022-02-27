import { DataTypes,HasManyAddAssociationMixin,HasManyAddAssociationsMixin,Model } from 'sequelize';
import { dbTtype, Image, Size } from '.';
import { sequelize } from './sequelize';

class Product extends Model{
    public readonly  id! : number;
    public readonly  productName! : string;
    public readonly  price! : number;
    public  stock! : number;
    public readonly  createdAt! : Date;
    public readonly  updatedAt! : Date;
    public addImages! : HasManyAddAssociationsMixin<Image, number>
    public addSizes! : HasManyAddAssociationsMixin<Size, number>
    public addSize! : HasManyAddAssociationMixin<Size, number>
}
            Product.init({
            productName : {
                type : DataTypes.STRING(50),
                allowNull : false,
            },
            price : {
                type : DataTypes.INTEGER,
                allowNull : false,
            },
            stock: {
                type : DataTypes.INTEGER,
                allowNull : false,
            },

        },{
            sequelize,
            modelName: 'Product',
            tableName: 'products',
            charset: 'utf8',
            collate: 'utf8_general_ci', 
             
        })
    export const associate = (db:dbTtype) =>{
        db.Product.belongsTo(db.User);
        db.Product.hasMany(db.Size);
        db.Product.hasMany(db.Image);
        db.Product.hasMany(db.Review); 
        db.Product.belongsToMany(db.User, {through : 'Like', as: 'Likers'})
        db.Product.belongsToMany(db.User, {through: {model: db.Cart,unique: false}})
        db.Product.belongsToMany(db.User, {through: {model: db.HistoryCart,unique: false}})
    }
export default Product