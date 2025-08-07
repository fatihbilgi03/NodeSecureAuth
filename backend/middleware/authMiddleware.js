

// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
  // 1) Header’dan token’ı çek (Bearer <token>)
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token bulunamadı, yetkisiz.' });
  }
  const token = authHeader.split(' ')[1];

  try {
    // 2) Token’ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECREaT_KEY);

    // 3) decoded.user hem id, hem role içeriyor artık
    req.user = decoded.user; 
    next();
  } catch (err) {
    console.error('JWT doğrulama hatası:', err);
    return res.status(401).json({ message: 'Geçersiz token.' });
  }
};
function authMiddleware(req, res, next) {
  // Daha güvenli okuma:
  const authHeader = req.get('Authorization') || req.headers.authorization;
  console.log('▶ authHeader:', authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: 'Erişim reddedildi, token sağlanmadı.' });
  }

  const token = authHeader.replace(/^Bearer\s+/i, '');
  console.log('▶ token to verify:', token);

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('▶ verified payload:', verified);
    // Payload içinde user objenizin anahtarını buraya uyarlayın:
    req.user = verified.user || verified;  
    next();
  } catch (err) {
    console.error('▶ JWT verify error:', err.message);
    res.status(403).json({ message: 'Geçersiz token.' });
  }
}

module.exports = authMiddleware;
