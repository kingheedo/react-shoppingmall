const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require("../config/config")[env]
const db = {};

const cart = require('./cart')
const image = require('./image')
const payment = require('./payment')
const review = require('./review')
const product = require('./product')
const size = require('./size')
const user = require('./user')

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Cart = cart;
db.Image = image;
db.Payment = payment;
db.Review = review;
db.Product = product;
db.Size = size;
db.User = user;

Object.keys(db).forEach(modelName => {
  db[modelName].init(sequelize);
})

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
