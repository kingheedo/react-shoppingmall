import { BelongsToManyGetAssociationsMixin, BelongsToManyRemoveAssociationMixin, DATEONLY, DataTypes,HasManyAddAssociationMixin,HasManyAddAssociationsMixin,HasManyGetAssociationsMixin,HasManyRemoveAssociationMixin,Model } from 'sequelize';
import { dbTtype, Image, Review, Size, User } from '.';
import { sequelize } from './sequelize';

class Product extends Model{
    public readonly  id! : number;
    public readonly  productName! : string;
    public readonly  price! : number;
    public readonly stock! : number;
    public readonly  createdAt! : Date;
    public readonly  updatedAt! : Date;
    public addImages! : HasManyAddAssociationsMixin<Image, number>
    public addSizes! : HasManyAddAssociationsMixin<Size, number>
    public addSize! : HasManyAddAssociationMixin<Size, number>
    public getReviews!: HasManyGetAssociationsMixin<Review>
    public addLikers! : BelongsToManyRemoveAssociationMixin<User, number>
    public removeLikers! : BelongsToManyRemoveAssociationMixin<User, number>
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
            sex: {
                type: DataTypes.INTEGER,
                allowNull: false
            }

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
        db.Product.belongsToMany(db.User, {through : 'Like', as: 'Likers'})
        db.Product.belongsToMany(db.User, {through: {model: db.Cart,unique: false}})
        db.Product.belongsToMany(db.User, {through: {model: db.HistoryCart,unique: false}})
        db.Product.belongsToMany(db.User, {through: {model: db.Review, unique: true}})
    }
export default Product