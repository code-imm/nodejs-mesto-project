import bcrypt from 'bcryptjs';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/user';
import BadRequestError from '../shared/errors/BadRequestError';
import ConflictError from '../shared/errors/ConflictError';
import UnauthorizedError from '../shared/errors/UnauthorizedError';
import JWT_SECRET_KEY from '../shared/configs/auth';

const errorMessages = {
  createUser: 'Переданы некорректные данные при создании пользователя.',
  duplicateEmail: 'Пользователь с таким email уже существует.',
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10).then((hash) => User.create({
    name,
    about,
    avatar,
    email,
    password: hash,
  })
    .then((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...userWithoutPassword } = user.toObject();
      res.send(userWithoutPassword);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(errorMessages.createUser));
      } else if (err.code === 11000) {
        next(new ConflictError(errorMessages.duplicateEmail));
      } else {
        next(err);
      }
    }));
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, {
        expiresIn: '7d',
      });

      res.send({ token });
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};
