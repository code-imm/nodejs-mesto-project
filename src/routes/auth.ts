import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { createUser, login } from '../controllers/auth';

const router = Router();

const userSchema = {
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

const signupSchema: Joi.Schema = Joi.object({
  ...userSchema,
  name: Joi.string().min(2).max(30).optional(),
  about: Joi.string().min(2).max(200).optional(),
  avatar: Joi.string().uri().optional(),
});

const signinSchema: Joi.Schema = Joi.object({
  ...userSchema,
});

router.post(
  '/signup',
  celebrate({
    [Segments.BODY]: signupSchema,
  }),
  createUser,
);
router.post(
  '/signin',
  celebrate({
    [Segments.BODY]: signinSchema,
  }),
  login,
);

export default router;
