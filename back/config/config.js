"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const config = {
    "development": {
        "username": "root",
        "password": process.env.DB_PASSWORD,
        "database": "react-shoppingmall",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "test": {
        "username": "root",
        "password": process.env.DB_PASSWORD,
        "database": "react-shoppingmall",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "production": {
        "username": "root",
        "password": process.env.DB_PASSWORD,
        "database": "react-shoppingmall",
        "host": "127.0.0.1",
        "dialect": "mysql"
    }
};
exports.default = config;
