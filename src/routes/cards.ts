import { Router } from "express";
import { body, checkExact, param } from "express-validator";
import {
  createCard,
  deleteCardById,
  dislikeCard,
  getCards,
  likeCard,
} from "../controllers/cards";
import { handleValidationErrors } from "../shared/utils/validationUtils";

const router = Router();

const errorMessages = {
  createCard: "Переданы некорректные данные при создании карточки.",
  invalidCardIdError: "Передан несуществующий _id карточки.",
};

const createCardValidation = [
  body("name").isString().isLength({ min: 2, max: 30 }).notEmpty(),
  body("link").isString().isURL().notEmpty(),
  checkExact([]),
  handleValidationErrors(errorMessages.createCard),
];

router.post("/", createCardValidation, createCard);
router.get("/", getCards);

const cardIdParamValidation = [
  param("id").isString().isAlphanumeric().isLength({ min: 24, max: 24 }),
  handleValidationErrors(errorMessages.invalidCardIdError),
];

router.delete("/:id", cardIdParamValidation, deleteCardById);
router.put("/:id/likes", cardIdParamValidation, likeCard);
router.delete("/:id/likes", cardIdParamValidation, dislikeCard);

export default router;
