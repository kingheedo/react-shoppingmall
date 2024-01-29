import User, {associate as associateUser} from './user';
import Cart, {associate as associateCart} from './cart';
import HistoryCart, {associate as associateHistoryCart} from './historyCart';
import Payment, {associate as associatePayment} from './payment';
import Image, {associate as associateImage} from './image';
import Product, {associate as associateProduct} from './product';
import Review, {associate as associateReview} from './review';
import Size, {associate as associateSize} from './size';
import Address, {associate as associateAddress} from './address';
import ReviewImage , {associate as associateReviewImage} from './reviewImage';


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
export {ReviewImage}

const db ={
  User,
  Cart,
  HistoryCart,
  Payment,
  Image,
  Product,
  Review,
  Size,
  Address,
  ReviewImage
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
associateReviewImage(db);