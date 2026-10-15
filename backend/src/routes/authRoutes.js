const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

// Public authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Authenticated session & profile routes
router.get('/me', requireAuth, authController.getMe);
router.patch('/me', requireAuth, authController.updateMe);
router.post('/change-password', requireAuth, authController.changePassword);

module.exports = router;
