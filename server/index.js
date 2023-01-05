const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
const router = require('./router/index')
const errorMiddleWare = require('./middlewares/error-middleware')
require('dotenv').config()

const PORT = process.env.PORT || 5000
const DBURL = process.env.DB_URL
const app = express()


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
    }
));
app.use('/api', router);
app.use(errorMiddleWare);

const start = async () =>{
    try {
        await mongoose.connect(DBURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
       app.listen(PORT,() => console.log(`Сервер запущен на порту ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
start()
