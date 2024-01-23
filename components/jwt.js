import jwt from 'jsonwebtoken';

const secretKey = 'suaChaveSecretaSuperSecreta'; 

const generateToken = (userId) => {
  return jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

export { generateToken, verifyToken };
