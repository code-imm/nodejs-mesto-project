import HttpStatusCodes from '../types/HttpStatusCodes';

class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatusCodes.CONFLICT;
    this.name = 'ConflictError';
  }
}

export default ConflictError;
