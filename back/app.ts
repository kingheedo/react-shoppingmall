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
import helmet from 'helmet'
import * as morgan from 'morgan'
import * as hpp from 'hpp'

dotenv.config();
const app = express();
const prod = process.env.NODE_ENV === 'production';

sequelize.sync({force: false})
    .then(() =>{
        console.log('db 연결 성공');
    })
    .catch((err:Error) => {
        console.error(err)
    });
passportConfig();

if(prod){
    app.use(morgan('combined'));
    app.use(hpp());
    app.use(helmet());
    app.use(cors({
        origin: 'https://reactshoppingmall.com',
        credentials: true,
    }))
}else{
    app.use(morgan('dev'));
    app.use(cors({
        origin: true,
        credentials: true,
    }))
    }

app.use(cookieParser(process.env.COOKIE_SECRET))
app.use('/', express.static(path.join(__dirname,'uploads')))
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(session({
    saveUninitialized : false,
    resave: false,
    secret: process.env.COOKIE_SECRET!,
    cookie:{
        httpOnly : true,
        secure: true,
        domain: process.env.NODE_ENV === 'production' ? '.reactshoppingmall.com' : undefined,
    },
    name: 'rnbck',
}))

app.use(passport.initialize());
app.use(passport.session());



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
app.listen(3065, () => {
    console.log('서버 실행 중')
})