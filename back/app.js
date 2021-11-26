const express = require('express');
const app = express();
const productRouter = require('./routes/product');
const db = require('./models')

db.sequelize.sync()
    .then(() =>{
        console.log('db 연결 성공');
    })
    .catch(console.error);

app.get('/', (req, res) =>{
    res.send('hello express');
})

app.use('/post',productRouter)
app.listen(3065, () => {
    console.log('서버 실행 중')
})