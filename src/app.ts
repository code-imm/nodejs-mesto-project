import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import mongoose from 'mongoose';
import { CelebrateError } from 'celebrate';
import auth from './middlewares/auth';
import { errorLogger, requestLogger } from './middlewares/logger';
import authRoutes from './routes/auth';
import cardRoutes from './routes/cards';
import userRoutes from './routes/users';
import HttpStatusCodes from './shared/types/HttpStatusCodes';

const errorMessages = {
  invalidJson: 'Некорректный JSON',
  invalidRequest: 'Некорректный запрос',
  internalServerError: 'На сервере произошла ошибка',
  notFoundError: 'Страница не найдена',
};

const { PORT = 3000, MONGO_URI = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

connectToDatabase();

const app = express();

app.use(express.json());

app.use((err: SyntaxError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: errorMessages.invalidJson });
  } else {
    next(err);
  }
});

app.use(requestLogger);

app.use('/', authRoutes);

app.use(auth);

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use((req, res) => {
  res
    .status(HttpStatusCodes.NOT_FOUND)
    .send({ message: errorMessages.notFoundError });
});

app.use(errorLogger);

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || HttpStatusCodes.INTERNAL_SERVER_ERROR;
  const message = statusCode === HttpStatusCodes.INTERNAL_SERVER_ERROR
    ? errorMessages.internalServerError
    : err.message;

  if (err instanceof CelebrateError) {
    res.status(HttpStatusCodes.BAD_REQUEST).send({
      message: errorMessages.invalidRequest,
    });
    return;
  }

  res.status(statusCode).send({ message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
