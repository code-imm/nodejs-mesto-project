import HttpStatusCodes from '../types/HttpStatusCodes';

class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatusCodes.UNAUTHORIZED;
    this.name = 'UnauthorizedError';
  }
}

export default UnauthorizedError;
