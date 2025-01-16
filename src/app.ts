import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cardRoutes from "./routes/cards";
import userRoutes from "./routes/users";
import { AuthenticatedRequest } from "./shared/types/AuthenticatedRequest";
import { HttpStatusCodes } from "./shared/types/HttpStatusCodes";

const errorMessages = {
  invalidJson: "Некорректный JSON",
  internalServerError: "На сервере произошла ошибка",
};

const { PORT = 3000 } = process.env;

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/mestodb");
}

main().catch((err) => console.log(err));

const app = express();

app.use(express.json());

app.use((err: SyntaxError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: errorMessages.invalidJson });
  } else {
    next();
  }
});

app.use((req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: "678222b5991c63ba3e033a92",
  };

  next();
});

app.use("/users", userRoutes);
app.use("/cards", cardRoutes);

app.use((err: any, req: Request, res: Response) => {
  const { statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === HttpStatusCodes.INTERNAL_SERVER_ERROR
        ? errorMessages.internalServerError
        : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
