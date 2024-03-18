import * as express from 'express'
import {sequelize} from './models'
import authRouter from './routes/auth';
import cartRouter from './routes/cart'
import productRouter from './routes/product'
import productsRouter from './routes/products'
import userRouter from './routes/user';
import paymentRouter from './routes/payment';
import adminRouter from './routes/admin';
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
    app.set('trust proxy',1);
    app.use(morgan('combined'));
    app.use(hpp());
    app.use(helmet());
    app.use(cors({
        origin: ['https://next-react.shop', 'https://admin.next-react.shop'],
        credentials: true,
    }))
}else{
    app.use(morgan('dev'));
    app.use(cors({
        origin: ['http://localhost:3060', 'http://3.37.228.220'],
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
    proxy: true,
    cookie:{
        httpOnly : true, //true면 js로 접근 금지
        secure: process.env.NODE_ENV === 'production' ? true : false, //https면 true로 적용
        // domain: process.env.NODE_ENV === 'production' ? 'http://3.37.228.220' : undefined,
        domain: process.env.NODE_ENV === 'production' ? '.next-react.shop' : undefined,
    },
    name: 'rnbck',
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/product',productRouter);
app.use('/products',productsRouter);
app.use('/cart',cartRouter);
app.use('/payment', paymentRouter);
app.use('/admin', adminRouter);

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