import HttpStatusCodes from './HttpStatusCodes';

class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatusCodes.NOT_FOUND;
  }
}

export default NotFoundError;
