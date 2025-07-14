const express = require("express");
const { signup, login, getTokens } = require("../controllers/authController");
const { verifyValidToken } = require("../core/auth/auth-token");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get('/refresh_token', verifyValidToken, getTokens)

// Exports the router
module.exports = router;