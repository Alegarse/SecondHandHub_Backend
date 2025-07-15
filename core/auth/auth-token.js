const jwt = require('jsonwebtoken');

const generateSecureToken = (payload, isRefreshToken) => {
  if (isRefreshToken)
    return jwt.sign(payload, process.env.SECRET_TOKEN_REFRESH, {
      expiresIn: '7d',
    });

  return jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: '1d' });
};

module.exports = { generateSecureToken };
