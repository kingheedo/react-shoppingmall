"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const models_1 = require("./models");
const auth_1 = require("./routes/auth");
const cart_1 = require("./routes/cart");
const product_1 = require("./routes/product");
const products_1 = require("./routes/products");
const user_1 = require("./routes/user");
const payment_1 = require("./routes/payment");
const admin_1 = require("./routes/admin");
const cors = require("cors");
const passport_1 = require("./passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require("morgan");
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
// if(prod){
//     app.use(morgan('combined'));
//     app.use(hpp());
//     app.use(helmet());
//     app.use(cors({
//         origin: 'http://52.78.109.197',
//         credentials: true,
//     }))
// }else{
//     app.use(morgan('dev'));
//     app.use(cors({
//         origin: ['http://localhost:3060', 'http://52.78.109.197'],
//         credentials: true,
//     }))
//     }
app.use(morgan('dev'));
app.use(cors({
    origin: ['http://localhost:3060', 'http://52.78.109.197'],
    credentials: true,
}));
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
        // secure: process.env.NODE_ENV === 'production' ? true : false,
        // domain: process.env.NODE_ENV === 'production' ? 'http://52.78.109.197' : undefined,
        secure: false,
        domain: process.env.NODE_ENV === 'production' ? 'http://52.78.109.197' : undefined,
    },
    name: 'rnbck',
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', auth_1.default);
app.use('/user', user_1.default);
app.use('/product', product_1.default);
app.use('/products', products_1.default);
app.use('/cart', cart_1.default);
app.use('/payment', payment_1.default);
app.use('/admin', admin_1.default);
app.get('/', (req, res, next) => {
    res.send('백엔드 정상 동작');
});
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('서버 에러 발생');
});
app.listen(prod ? 80 : 3065, () => {
    console.log('서버 실행 중');
});
