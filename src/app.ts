import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import postsRouter from './routes/posts';
import postWithUserRouter from './routes/postwithuser';
import productRouter from './routes/products';
import restaurantsRouter from './routes/restaurants';
import authRouter from './routes/auth';
import companiesRouter from './routes/companies';
import addressesRouter from './routes/addresses';
import ordersRouter from './routes/orders';

const app: Express = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/postwithuser', postWithUserRouter);
app.use('/products', productRouter);
app.use('/restaurants', restaurantsRouter);
app.use('/auth', authRouter);
app.use('/companies', companiesRouter);
app.use('/addresses', addressesRouter);
app.use('/orders', ordersRouter);

// Error handling middleware (optional, but good practice)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
