import HttpStatusCodes from '../types/HttpStatusCodes';

class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatusCodes.NOT_FOUND;
    this.name = 'NotFoundError';
  }
}

export default NotFoundError;
