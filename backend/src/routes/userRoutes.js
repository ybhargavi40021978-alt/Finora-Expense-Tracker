const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

// Support /api/users endpoints
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', requireAuth, authController.getMe);
router.patch('/me', requireAuth, authController.updateMe);
router.patch('/me/password', requireAuth, authController.changePassword);

module.exports = router;
