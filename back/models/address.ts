import {DataTypes, Model} from 'sequelize';
import { dbTtype } from '.';
import {sequelize} from './sequelize'

class Address extends Model{
  public id!:number;
  public postNum!: string;
  public base!: string;
  public detail!: string | null;
  public UserId!: number;
}
Address.init({
  postNum: {
    type: DataTypes.STRING(5),
    allowNull:false
  },
  base:{ 
    type: DataTypes.STRING(100),
    allowNull: false
  },
  detail: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Address',
  tableName: 'addresses',
  charset: 'utf8',
  collate: 'utf8_general_ci'
})

export const associate = (db: dbTtype) => {
  db.Address.belongsTo(db.User)
}
export default Address;