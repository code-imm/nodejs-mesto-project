import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import User from "../models/user";
import { AuthenticatedRequest } from "../shared/types/AuthenticatedRequest";
import { BadRequestError, NotFoundError } from "../shared/types/HttpError";

const errorMessages = {
  notFoundUser: "Пользователь с указанным _id не найден.",
  userUpdate: "Ошибка при обновлении профиля пользователя.",
  invalidUserIdError: "Передан несуществующий _id пользователя.",
  userAvatarUpdate: "Ошибка при обновлении аватара пользователя.",
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch(next);
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction
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
    .catch(next);
};

export const updateUserProfile = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  User.findByIdAndUpdate(req.user?._id, { ...req.body }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errorMessages.notFoundUser);
      }

      res.send(user);
    })
    .catch(next);
};

export const updateUserAvatar = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errorMessages.notFoundUser);
      }

      res.send(user);
    })
    .catch(next);
};
