import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import {
  getUser,
  getUserById,
  getUsers,
  updateUserAvatar,
  updateUserProfile,
} from '../controllers/users';

const router = Router();

const userParamsSchema: Joi.Schema = Joi.object({
  id: Joi.string().hex().length(24),
});

const updateUserProfileSchema: Joi.Schema = Joi.object({
  name: Joi.string().min(2).max(30).optional(),
  about: Joi.string().min(2).max(200).optional(),
});

const updateUserAvatarSchema: Joi.Schema = Joi.object({
  avatar: Joi.string().uri().optional(),
});

router.get('/', getUsers);
router.get('/me', getUser);
router.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: userParamsSchema,
  }),
  getUserById,
);
router.patch(
  '/me',
  celebrate({
    [Segments.BODY]: updateUserProfileSchema,
  }),
  updateUserProfile,
);
router.patch(
  '/me/avatar',
  celebrate({
    [Segments.BODY]: updateUserAvatarSchema,
  }),
  updateUserAvatar,
);

export default router;
