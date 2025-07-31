const express = require('express');
const {
  signup,
  login,
  getTokens,
  verifyToken,
  verifyMail,
  requestPasswordReset,
  resetPasswordFromToken,
} = require('../controllers/authController');
const { verifyValidToken } = require('../core/middlewares/auth');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify_email', verifyMail);
router.get('/refresh_token', verifyValidToken, getTokens);
router.get('/verify_token', verifyValidToken, verifyToken);

router.post('/request-reset', requestPasswordReset);
router.get('/reset-password/:token', resetPasswordFromToken);

// Exports the router
module.exports = router;
