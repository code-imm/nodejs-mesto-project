import { NextFunction, Response } from 'express';
import Card from '../models/card';
import { AuthenticatedRequest } from '../shared/types/AuthenticatedRequest';
import { NotFoundError } from '../shared/types/NotFoundError';

const errorMessages = {
  cardNotFound: 'Карточка с указанным _id не найдена.',
  cardDeleteError: 'Ошибка при удалении карточки.',
};

export const createCard = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.send({ data: card }))
    .catch(next);
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
    .catch(next);
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
    .catch(next);
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
    .catch(next);
};
