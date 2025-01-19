import { Router } from 'express';
import {
  createUser,
  getUserById,
  getUsers,
  updateUserAvatar,
  updateUserProfile,
  login,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/signin', login);
router.post('/signup', createUser);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateUserAvatar);

export default router;
