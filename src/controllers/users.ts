import { NextFunction, Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import { HttpStatusCodes } from '../shared/types/HttpStatusCodes';
import { AuthenticatedRequest } from '../shared/types/AuthenticatedRequest';
import { BadRequestError } from '../shared/types/BadRequestError';
import { NotFoundError } from '../shared/types/NotFoundError';
import User from '../models/user';

const errorMessages = {
  createUser: 'Переданы некорректные данные при создании пользователя.',
  updateUserProfile: 'Переданы некорректные данные при обновлении профиля.',
  updateUserAvatar: 'Переданы некорректные данные при обновлении аватара.',
  notFoundUser: 'Пользователь с указанным _id не найден.',
  userUpdate: 'Ошибка при обновлении профиля пользователя.',
  invalidUserIdError: 'Передан несуществующий _id пользователя.',
  userAvatarUpdate: 'Ошибка при обновлении аватара пользователя.',
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: errorMessages.createUser });
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

  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError(errorMessages.invalidUserIdError);
  }

  User.findById({ _id: id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errorMessages.notFoundUser);
      }

      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: errorMessages.invalidUserIdError });
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
  User.findByIdAndUpdate(req.user?._id, { ...req.body }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errorMessages.notFoundUser);
      }

      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: errorMessages.updateUserProfile });
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

  User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errorMessages.notFoundUser);
      }

      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: errorMessages.updateUserAvatar });
      } else {
        next(err);
      }
    });
};
