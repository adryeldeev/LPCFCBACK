import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ sem o "!"
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido ou expirado' });
  }
};
