
import { CreateOptions, DataTypes, Model } from 'sequelize'
import {dbTtype} from '.'
import {sequelize} from './sequelize'
 class Review extends Model{
    public readonly id! : number;
    public readonly content! : string;
    public readonly rate! : number;
    public readonly reviewUnique! : string;
    public readonly createdAt! : Date;
    public readonly updatedAt! : Date;
    }
    Review.init({
            content : {
                type : DataTypes.STRING(50),
                allowNull : false,
            },
            rate: {
                type : DataTypes.INTEGER,
                allowNull: false,
            },
            reviewUnique : { 
                type: DataTypes.STRING(200), 
                unique: true 
            }
        },{
            sequelize,   
            modelName: 'Review',
            tableName: 'reviews',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci', 
        })
    
     export const associate =(db:dbTtype) =>{
        db.Review.belongsTo(db.User)
        db.Review.belongsTo(db.Product)
    }
    export default Review