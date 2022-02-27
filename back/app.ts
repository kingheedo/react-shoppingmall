import * as express from 'express'
import {sequelize} from './models'

import cartRouter from './routes/cart'
import productRouter from './routes/product'
import productsRouter from './routes/products'
import userRouter from './routes/user'
import * as cors from 'cors'
import passportConfig from './passport'
import * as session from "express-session"
import * as cookieParser from 'cookie-parser'
import * as passport from 'passport'
import * as dotenv from 'dotenv'
import * as path from 'path'
const prod = process.env.NODE_ENV === 'production';

dotenv.config();
const app = express();
app.set('port',prod ? process.env.PORT : 3065 );

sequelize.sync({force: false})
    .then(() =>{
        console.log('db 연결 성공');
    })
    .catch((err:Error) => {
        console.error(err)
    });
passportConfig();

app.use('/', express.static(path.join(__dirname,'uploads')))
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(session({
    saveUninitialized : false,
    resave: false,
    secret: process.env.COOKIE_SECRET!,
    cookie:{
        httpOnly : true,
        secure: false,
        domain: prod ? '.reactshoppingmall.com' : undefined,
    },
    name: 'rnbck',
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser(process.env.COOKIE_SECRET))

app.use(cors({
    origin : 'http://localhost:3060',
    credentials: true,
}))

app.use('/user', userRouter)
app.use('/product',productRouter)
app.use('/products',productsRouter)
app.use('/cart',cartRouter)

app.get('/', (req, res, next) => {
    res.send('백엔드 정상 동작')
})
app.use((err: any, req:express.Request, res:express.Response, next:express.NextFunction) => {
    console.error(err);
    res.status(500).send('서버 에러 발생')
})
app.listen(app.get('port'), () => {
    console.log('서버 실행 중')
})