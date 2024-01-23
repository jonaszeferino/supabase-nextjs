// authMiddleware.js

import { verifyToken } from './jwt';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const userId = verifyToken(token);

  if (!userId) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  req.userId = userId;
  next();
};

export default authMiddleware;
