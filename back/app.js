const express = require('express');
const app = express();
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');
const db = require('./models')
const cors = require('cors')

db.sequelize.sync()
    .then(() =>{
        console.log('db 연결 성공');
    })
    .catch(console.error);

app.use(cors({
    origin: '*',
}))
app.use(express.json());
app.use(express.urlencoded({extended: true}))


app.get('/', (req, res) =>{
    res.send('hello express');
})


app.use('/user', userRouter)
app.use('/product',productRouter)
app.listen(3065, () => {
    console.log('서버 실행 중')
})