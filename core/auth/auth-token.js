const jwt = require("jsonwebtoken");

const generateSecureToken = (payload, isRefreshToken) => {
    if (isRefreshToken)
        return jwt.sign(payload, process.env.SECRET_TOKEN_REFRESH, { expiresIn: "1d" });

    return jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: "7d" });
};

module.exports = generateSecureToken;