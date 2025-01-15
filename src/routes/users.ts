import { Router } from "express";
import { body, checkExact } from "express-validator";
import {
  createUser,
  getUserById,
  getUsers,
  updateUserAvatar,
  updateUserProfile,
} from "../controllers/users";
import { handleValidationErrors } from "../shared/utils/validationUtils";

const router = Router();

const errorMessages = {
  createUser: "Переданы некорректные данные при создании пользователя.",
  updateUserProfile: "Переданы некорректные данные при обновлении профиля.",
  updateUserAvatar: "Переданы некорректные данные при обновлении аватара.",
};

router.get("/", getUsers);
router.get("/:id", getUserById);

const createUserValidation = [
  body("name").isString().isLength({ min: 2, max: 30 }).notEmpty(),
  body("about").isString().isLength({ min: 2, max: 200 }).notEmpty(),
  body("avatar").isString().notEmpty(),
  checkExact([]),
  handleValidationErrors(errorMessages.createUser),
];

router.post("/", createUserValidation, createUser);

const updateUserProfileValidation = [
  body("name").isString().isLength({ min: 2, max: 30 }).notEmpty().optional(),
  body("about").isString().isLength({ min: 2, max: 200 }).notEmpty().optional(),
  checkExact([]),
  handleValidationErrors(errorMessages.updateUserProfile),
];

router.patch("/me", updateUserProfileValidation, updateUserProfile);

const updateUserAvatarValidation = [
  body("avatar").isString().isURL().notEmpty(),
  checkExact([]),
  handleValidationErrors(errorMessages.updateUserAvatar),
];

router.patch("/me/avatar", updateUserAvatarValidation, updateUserAvatar);

export default router;
