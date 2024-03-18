import { DataTypes, Model } from 'sequelize';
import {sequelize} from './sequelize';
import { dbTtype } from '.';

class ReviewImage extends Model{
  public readonly id!: number;
  public src!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ReviewImage.init({
    src: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
  },{
    modelName: 'ReviewImage',
    tableName: 'reviewImages',
    charset: 'utf8',
    collate: 'utf8_general_ci',
    sequelize,
  })
export const associate = (db: dbTtype) => {
  db.ReviewImage.belongsTo(db.Review);
}
export default ReviewImage;