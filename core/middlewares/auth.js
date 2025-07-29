const jwt = require('jsonwebtoken');
const { getOwnerByProductId } = require('../utils/functions');

const verifyValidToken = (req, res, next) => {
  const token = req.header('auth-token');
  try {
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

const verifyOwner = async (req, res, next) => {
  const token = req.header("auth-token");
  const { idProduct } = req.params;
  const idOwnerByIdProduct = await getOwnerByProductId(idProduct)
  try {
    const payload = jwt.verify(token, process.env.SECRET_TOKEN);
    const idOwner = payload._id;
    req.payload = payload;
    if (String(idOwner) !== String(idOwnerByIdProduct)) {
      return res
        .status(401)
        .send("Access allowed only to the product owner");
    }
    next();
  } catch (error) {
    try {
      const payload = jwt.verify(token, process.env.SECRET_TOKEN_REFRESH);
      const idOwner = payload._id;
      req.payload = payload;
      if (String(idOwner) !== String(idOwnerByIdProduct)) {
      return res
        .status(401)
        .send("Access allowed only to the product owner");
    }
      next();
    } catch (error) {
      res
        .status(401)
        .send({ status: "Token has expired", error: error.message });
    }
  }
};

module.exports = { verifyValidToken, verifyOwner };