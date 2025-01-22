import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import SECRET_KEY from '../shared/configs/auth';
import UnauthorizedError from '../shared/errors/UnauthorizedError';

interface JwtPayloadWithId extends jwt.JwtPayload {
  _id: string;
}

const errorMessages = {
  authorizationRequired: 'Необходима авторизация',
};

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError(errorMessages.authorizationRequired));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY) as JwtPayloadWithId;
  } catch {
    next(new UnauthorizedError(errorMessages.authorizationRequired));
    return;
  }

  req.user = payload;

  next();
};
