const dotenv = require('dotenv');
dotenv.config();

 module.exports = {
  "development": { //개발용
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "react-shoppingmall",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": { //테스트용
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "react-shoppingmall",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": { //배포용
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "react-shoppingmall",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}