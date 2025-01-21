import HttpStatusCodes from '../types/HttpStatusCodes';

class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatusCodes.FORBIDDEN;
    this.name = 'ForbiddenError';
  }
}

export default ForbiddenError;
