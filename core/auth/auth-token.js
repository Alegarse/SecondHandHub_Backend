const jwt = require('jsonwebtoken');

const generateSecureToken = (payload, isRefreshToken) => {
  if (isRefreshToken)
    return jwt.sign(payload, process.env.SECRET_TOKEN_REFRESH, {
      expiresIn: '7d',
    });

  return jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: '1d' });
};

const verifyValidToken = (req, res, next) => {
  try {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Unauthorized access');
    const payload = jwt.verify(token, process.env.SECRET_TOKEN);
    req.payload = payload;
    next();
  } catch (error) {
    try {
      const payload = jwt.verify(token, process.env.SECRET_TOKEN_REFRESH);
      req.payload = payload;
      next();
    } catch (error) {
      res.status(401).send({ status: 'Token expired', error: error.message });
    }
  }
};

module.exports = { generateSecureToken, verifyValidToken };
