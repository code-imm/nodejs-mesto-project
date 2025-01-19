import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';
import type { AuthenticatedRequest } from '../shared/types/AuthenticatedRequest';
import HttpStatusCodes from '../shared/types/HttpStatusCodes';

const errorMessages = {
  createUser: 'Переданы некорректные данные при создании пользователя.',
  updateUserProfile: 'Переданы некорректные данные при обновлении профиля.',
  updateUserAvatar: 'Переданы некорректные данные при обновлении аватара.',
  notFoundUser: 'Пользователь с указанным _id не найден.',
  invalidUserIdError: 'Передан несуществующий _id пользователя.',
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.create({
    name, about, avatar, email, password,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res
          .status(HttpStatusCodes.CREATED)
          .send({ message: errorMessages.createUser });
      } else {
        next(err);
      }
    });
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  User.findById({ _id: id })
    .then((user) => {
      if (!user) {
        res
          .status(HttpStatusCodes.NOT_FOUND)
          .send({ message: errorMessages.notFoundUser });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .send({ message: errorMessages.invalidUserIdError });
      } else {
        next(err);
      }
    });
};

export const updateUserProfile = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user?._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(HttpStatusCodes.NOT_FOUND)
          .send({ message: errorMessages.notFoundUser });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .send({ message: errorMessages.updateUserProfile });
      } else {
        next(err);
      }
    });
};

export const updateUserAvatar = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user?._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(HttpStatusCodes.NOT_FOUND)
          .send({ message: errorMessages.notFoundUser });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .send({ message: errorMessages.updateUserAvatar });
      } else {
        next(err);
      }
    });
};
