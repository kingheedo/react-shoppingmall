const express = require('express');
const app = express();
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');
const db = require('./models')
const cors = require('cors')
const passportConfig = require('./passport')
const session = require("express-session")
const cookieParser = require('cookie-parser');
const passport = require('passport')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config();
db.sequelize.sync()
    .then(() =>{
        console.log('db 연결 성공');
    })
    .catch(console.error);
passportConfig();

app.use('/', express.static(path.join(__dirname,'uploads')))
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(session({
    saveUninitialized : false,
    resave: false,
    secret: process.env.COOKIE_SECRET
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser(process.env.COOKIE_SECRET))

app.use(cors({
    origin : 'http://localhost:3060',
    credentials: true,
}))

app.get('/', (req, res) =>{
    res.send('hello express');
})


app.use('/user', userRouter)
app.use('/product',productRouter)
app.listen(3065, () => {
    console.log('서버 실행 중')
})