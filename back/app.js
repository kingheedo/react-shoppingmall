const express = require('express');
const app = express();
const productRouter = require('./routes/product');

app.use('/post',productRouter)
app.listen(3065, () => {
    console.log('서버 실행 중')
})