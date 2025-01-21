import HttpStatusCodes from '../types/HttpStatusCodes';

class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatusCodes.BAD_REQUEST;
    this.name = 'BadRequestError';
  }
}

export default BadRequestError;
