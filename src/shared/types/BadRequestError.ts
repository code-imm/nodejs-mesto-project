import { HttpStatusCodes } from "./HttpStatusCodes";

export class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatusCodes.BAD_REQUEST;
  }
}
