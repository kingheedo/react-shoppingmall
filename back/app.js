"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const models_1 = require("./models");
const cart_1 = require("./routes/cart");
const product_1 = require("./routes/product");
const products_1 = require("./routes/products");
const user_1 = require("./routes/user");
const cors = require("cors");
const passport_1 = require("./passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const dotenv = require("dotenv");
const path = require("path");
const helmet_1 = require("helmet");
const morgan = require("morgan");
const hpp = require("hpp");
dotenv.config();
const app = express();
const prod = process.env.NODE_ENV === 'production';
models_1.sequelize.sync({ force: false })
    .then(() => {
    console.log('db 연결 성공');
})
    .catch((err) => {
    console.error(err);
});
(0, passport_1.default)();
if (prod) {
    app.use(morgan('combined'));
    app.use(hpp());
    app.use((0, helmet_1.default)());
    app.use(cors({
        origin: 'https://reactshoppingmall.com',
        credentials: true,
    }));
}
else {
    app.use(morgan('dev'));
    app.use(cors({
        origin: true,
        credentials: true,
    }));
}
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        domain: process.env.NODE_ENV === 'production' ? '.reactshoppingmall.com' : undefined,
    },
    name: 'rnbck',
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/user', user_1.default);
app.use('/product', product_1.default);
app.use('/products', products_1.default);
app.use('/cart', cart_1.default);
app.get('/', (req, res, next) => {
    res.send('백엔드 정상 동작');
});
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('서버 에러 발생');
});
app.listen(3065, () => {
    console.log('서버 실행 중');
});
