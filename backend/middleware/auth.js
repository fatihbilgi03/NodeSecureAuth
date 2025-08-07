//middleware/auth.js

const jwt = require('jsonwebtoken');

// Gizli anahtarı .env dosyasından veya sabit bir değerden alın
const secretKey = process.env.JWT_SECRET || 'yourJWTsecret';

function verifyToken(req, res, next) {
  // Authorization başlığı “Bearer <token>” formatında gelmeli
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Access Denied' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Token’ı doğrula ve decode edilen payload’ı al
    const verified = jwt.verify(token, secretKey);
    // Kullanıcı bilgilerini isteğe ekle
    req.user = verified;
    return next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

module.exports = verifyToken;
