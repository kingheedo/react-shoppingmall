import {DataTypes, Model} from 'sequelize';
import { dbTtype } from '.';
import {sequelize} from './sequelize'

class Address extends Model{
  public id!:number;
  public rcName!: string;
  public rcPhone!: string;
  public rcPostNum!: string;
  public rcPostBase!: string;
  public rcPostDetail!: string | null;
  public UserId!: number;
}
Address.init({
  rcName: {
    type: DataTypes.STRING(20),
    allowNull:false
  },
  rcPhone: {
    type: DataTypes.STRING(11),
    allowNull:false
  },
  rcPostNum: {
    type: DataTypes.STRING(5),
    allowNull:false
  },
  rcPostBase:{ 
    type: DataTypes.STRING(100),
    allowNull: false
  },
  rcPostDetail: {
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
  db.Address.belongsTo(db.User);
  db.Address.belongsTo(db.Payment);
}
export default Address;