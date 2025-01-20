import type { NextFunction, Response, Request } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import HttpStatusCodes from '../shared/types/HttpStatusCodes';

const errorMessages = {
  cardNotFound: 'Карточка с указанным _id не найдена.',
  forbiddenCardDelete: 'Недостаточно прав для удаления этой карточки',
  cardDeleteError: 'Ошибка при удалении карточки.',
  invalidCardIdError: 'Передан несуществующий _id карточки.',
  createCard: 'Переданы некорректные данные при создании карточки.',
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res
          .status(HttpStatusCodes.CREATED)
          .send({ message: errorMessages.createCard });
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
        return res
          .status(HttpStatusCodes.NOT_FOUND)
          .send({ message: errorMessages.cardNotFound });
      }

      if (String(card.owner) !== String(req.user?._id)) {
        return res
          .status(HttpStatusCodes.FORBIDDEN)
          .send({ message: errorMessages.forbiddenCardDelete });
      }

      return Card.deleteOne({ _id: id })
        .then(() => res.send())
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .send({ message: errorMessages.invalidCardIdError });
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
        res
          .status(HttpStatusCodes.NOT_FOUND)
          .send({ message: errorMessages.cardNotFound });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .send({ message: errorMessages.invalidCardIdError });
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
        res
          .status(HttpStatusCodes.NOT_FOUND)
          .send({ message: errorMessages.cardNotFound });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .send({ message: errorMessages.invalidCardIdError });
      } else {
        next(err);
      }
    });
};
