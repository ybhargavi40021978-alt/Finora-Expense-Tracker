const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');
const { requireAuth } = require('../middleware/auth');

// Require authentication for all summary endpoints
router.use(requireAuth);

router.get('/monthly', summaryController.getMonthly);
router.get('/yearly', summaryController.getYearly);
router.get('/overall', summaryController.getOverall);

module.exports = router;
