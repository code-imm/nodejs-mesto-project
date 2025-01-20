import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const errorMessages = {
  authorizationRequired: 'Необходима авторизация',
};

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).send({ message: errorMessages.authorizationRequired });
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch {
    res.status(401).send({ message: errorMessages.authorizationRequired });
  }

  req.user = payload!;

  next();
};
