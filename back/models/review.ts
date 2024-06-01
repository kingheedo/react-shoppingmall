
import { DataTypes, HasManyAddAssociationMixin, Model } from 'sequelize'
import {ReviewImage, dbTtype} from '.'
import {sequelize} from './sequelize'
 class Review extends Model{
    public readonly id! : number;
    public readonly content! : string;
    public readonly rate! : number;
    public readonly createdAt! : Date;
    public readonly updatedAt! : Date;
    public readonly addReviewImages!: HasManyAddAssociationMixin<ReviewImage | ReviewImage[], number>;
    }
    Review.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            content : {
                type : DataTypes.STRING(50),
                allowNull : false,
            },
            rate: {
                type : DataTypes.INTEGER,
                allowNull: false,
            }
        },{
            sequelize,   
            modelName: 'Review',
            tableName: 'reviews',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci', 
        })
    
     export const associate =(db:dbTtype) =>{
         db.Review.hasMany(db.ReviewImage);
         db.Review.belongsTo(db.User);
         db.Review.belongsTo(db.Product);
         db.Review.belongsTo(db.Payment);
    }
    export default Review