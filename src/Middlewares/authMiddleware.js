import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];


  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    // Log para verificar a chave secreta usada

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  

    req.user = decoded;
    next();
  } catch (error) {
    // Log para capturar o erro ao verificar o token
    console.log('Erro ao verificar o token:', error.message);

    return res.status(403).json({ message: 'Token inválido ou expirado' });
  }
};