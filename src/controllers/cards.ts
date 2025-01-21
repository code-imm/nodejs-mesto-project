import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import BadRequestError from '../shared/errors/BadRequestError';
import ForbiddenError from '../shared/errors/ForbiddenError';
import NotFoundError from '../shared/errors/NotFoundError';
import HttpStatusCodes from '../shared/types/HttpStatusCodes';

const errorMessages = {
  cardNotFound: 'Карточка с указанным _id не найдена.',
  forbiddenCardDelete: 'Недостаточно прав для удаления этой карточки',
  createCard: 'Переданы некорректные данные при создании карточки.',
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.status(HttpStatusCodes.CREATED).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(errorMessages.createCard));
      } else {
        next(err);
      }
    });
};

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

export const deleteCardById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  Card.findById(id)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError(errorMessages.cardNotFound));
      }

      if (String(card.owner) !== String(req.user?._id)) {
        return next(new ForbiddenError(errorMessages.forbiddenCardDelete));
      }

      return Card.deleteOne({ _id: id })
        .then(() => res.send())
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(errorMessages.cardNotFound));
      } else {
        next(err);
      }
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError(errorMessages.cardNotFound));
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(errorMessages.cardNotFound));
      } else {
        next(err);
      }
    });
};

export const dislikeCard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  Card.findByIdAndUpdate(id, { $pull: { likes: req.user?._id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError(errorMessages.cardNotFound));
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(errorMessages.cardNotFound));
      } else {
        next(err);
      }
    });
};
