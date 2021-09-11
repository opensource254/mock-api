const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const postWithUserRouter = require('./routes/postwithuser');
const productRouter = require('./routes/products');
const restaurantsRouter = require('./routes/restaurants');
const authRouter = require('./routes/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/postwithuser', postWithUserRouter);
app.use('/products', productRouter)
app.use('/restaurants', restaurantsRouter)
app.use('/auth', authRouter)

module.exports = app;
