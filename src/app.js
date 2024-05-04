const express = require('express');
const bp = require('body-parser');
const connectDB = require('./db/connect');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const app = express();
connectDB();

app.use(express.json())
app.use(bp.urlencoded({extended: false}));
app.use(bp.json());
app.use(userRouter);
app.use(productRouter);

module.exports = app;