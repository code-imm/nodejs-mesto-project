import express from 'express';
import type{ NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cardRoutes from './routes/cards';
import userRoutes from './routes/users';
import type { AuthenticatedRequest } from './shared/types/AuthenticatedRequest';
import HttpStatusCodes from './shared/types/HttpStatusCodes';

const errorMessages = {
  invalidJson: 'Некорректный JSON',
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

app.use((req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  req.user = { _id: '678222b5991c63ba3e033a92' };
  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use((req, res) => {
  res.status(HttpStatusCodes.NOT_FOUND).send({ message: errorMessages.notFoundError });
});

app.use((err: any, req: Request, res: Response) => {
  const statusCode = err.statusCode || HttpStatusCodes.INTERNAL_SERVER_ERROR;
  const message = statusCode === HttpStatusCodes.INTERNAL_SERVER_ERROR
    ? errorMessages.internalServerError
    : err.message;

  res.status(statusCode).send({ message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
