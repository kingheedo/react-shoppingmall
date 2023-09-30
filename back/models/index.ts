import User, {associate as associateUser} from './user';
import Cart, {associate as associateCart} from './cart';
import HistoryCart, {associate as associateHistoryCart} from './historyCart';
import Payment, {associate as associatePayment} from './payment';
import Image, {associate as associateImage} from './image';
import Product, {associate as associateProduct} from './product';
import Review, {associate as associateReview} from './review';
import Size, {associate as associateSize} from './size';
import Address, {associate as associateAddress} from './address';

export * from './sequelize';
export {User};
export {Cart};
export {HistoryCart};
export {Payment};
export {Image};
export {Product};
export {Review};
export {Size};
export {Address};

const db ={
  User,
  Cart,
  HistoryCart,
  Payment,
  Image,
  Product,
  Review,
  Size,
  Address
};
export type dbTtype = typeof db;

associateUser(db);
associateCart(db);
associateHistoryCart(db);
associatePayment(db);
associateImage(db);
associateProduct(db);
associateReview(db);
associateSize(db);
associateAddress(db);