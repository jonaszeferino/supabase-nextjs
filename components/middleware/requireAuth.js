import { verifyToken } from '../utils/auth';

export default function requireAuth(handler) {
  return async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Adiciona as informações do usuário ao request
    req.user = decodedToken;

    return handler(req, res);
  };
}
