import bcrypt from 'bcryptjs';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/user';
import HttpStatusCodes from '../shared/types/HttpStatusCodes';

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
        res
          .status(HttpStatusCodes.CREATED)
          .send({ message: errorMessages.createUser });
      } else if (err.code === 11000) {
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .send({ message: errorMessages.duplicateEmail });
      } else {
        next(err);
      }
    }));
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', {
        expiresIn: '7d',
      });

      res.send({ token });
    })
    .catch((err) => {
      res.status(HttpStatusCodes.UNAUTHORIZED).send({ message: err.message });
    });
};
