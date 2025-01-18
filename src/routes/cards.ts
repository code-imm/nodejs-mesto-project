import { Router } from 'express';
import {
  createCard,
  deleteCardById,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';

const router = Router();

router.post('/', createCard);
router.get('/', getCards);
router.delete('/:id', deleteCardById);
router.put('/:id/likes', likeCard);
router.delete('/:id/likes', dislikeCard);

export default router;
