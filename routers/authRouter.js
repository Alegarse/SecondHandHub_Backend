const express = require("express");
const { signup, login, getTokens, verifyToken } = require("../controllers/authController");
const { verifyValidToken } = require("../core/middlewares/auth");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get('/refresh_token', verifyValidToken, getTokens)
router.get('/verify_token', verifyValidToken, verifyToken)

// Exports the router
module.exports = router;