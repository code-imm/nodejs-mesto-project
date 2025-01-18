import type { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import type { AuthenticatedRequest } from '../shared/types/AuthenticatedRequest';
import HttpStatusCodes from '../shared/types/HttpStatusCodes';
import NotFoundError from '../shared/types/NotFoundError';

const errorMessages = {
  cardNotFound: 'Карточка с указанным _id не найдена.',
  cardDeleteError: 'Ошибка при удалении карточки.',
  invalidCardIdError: 'Передан несуществующий _id карточки.',
  createCard: 'Переданы некорректные данные при создании карточки.',
};

export const createCard = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: errorMessages.createCard });
      } else {
        next(err);
      }
    });
};

export const getCards = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

export const deleteCardById = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  Card.deleteOne({ _id: id })
    .then((result) => {
      if (result.deletedCount === 0) {
        throw new NotFoundError(errorMessages.cardDeleteError);
      }

      res.send();
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: errorMessages.invalidCardIdError });
      } else {
        next(err);
      }
    });
};

export const likeCard = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(errorMessages.cardNotFound);
      }

      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: errorMessages.invalidCardIdError });
      } else {
        next(err);
      }
    });
};

export const dislikeCard = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  Card.findByIdAndUpdate(id, { $pull: { likes: req.user?._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError(errorMessages.cardNotFound);
      }

      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: errorMessages.invalidCardIdError });
      } else {
        next(err);
      }
    });
};
