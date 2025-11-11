const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || req.cookies.token;
  if (!authHeader) return res.status(401).json({ message: 'Token manquant' });

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = authMiddleware;
