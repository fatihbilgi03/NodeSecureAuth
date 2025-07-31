//middleware/authMiddleware.js


const jwt = require('jsonwebtoken');

// FUNCTION-RUN-GENERATED-CODE-START:authMiddleware
(async () => { console.log(await authMiddleware(/* OpenAI API key not provided */)); })();
// FUNCTION-RUN-GENERATED-CODE-END:authMiddleware

function authMiddleware(req, res, next) {
  const authHeader = req.header('Authorization');
  console.log('▶ authHeader:', authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: 'Erişim reddedildi, token sağlanmadı.' });
  }

  const token = authHeader.replace('Bearer ', '');
  console.log('▶ token to verify:', token);

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('▶ verified payload:', verified);
    req.user = verified.user;
    next();
  } catch (err) {
    console.error('▶ JWT verify error:', err.message);
    res.status(403).json({ message: 'Geçersiz token.' });
  }
}


module.exports = authMiddleware;