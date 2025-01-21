import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import {
  createCard,
  deleteCardById,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';

const router = Router();

const cardBodySchema: Joi.Schema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  link: Joi.string().uri().required(),
});

const cardParamsSchema: Joi.Schema = Joi.object({
  id: Joi.string().hex().length(24),
});

router.get('/', getCards);
router.post('/', celebrate({
  [Segments.BODY]: cardBodySchema,
}), createCard);
router.delete('/:id', celebrate({
  [Segments.PARAMS]: cardParamsSchema,
}), deleteCardById);
router.put('/:id/likes', celebrate({
  [Segments.PARAMS]: cardParamsSchema,
}), likeCard);
router.delete('/:id/likes', celebrate({
  [Segments.PARAMS]: cardParamsSchema,
}), dislikeCard);

export default router;
