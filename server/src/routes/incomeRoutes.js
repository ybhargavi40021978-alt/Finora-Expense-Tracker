const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');
const { validateId, validateIncomePayload } = require('../middleware/validateRequest');
const { requireAuth } = require('../middleware/auth');

// Require authentication for all income endpoints
router.use(requireAuth);

router.post('/', validateIncomePayload, incomeController.createIncome);
router.get('/', incomeController.getIncomeList);
router.get('/:id', validateId('id'), incomeController.getIncomeById);
router.patch('/:id', validateId('id'), validateIncomePayload, incomeController.updateIncome);
router.put('/:id', validateId('id'), validateIncomePayload, incomeController.updateIncome);
router.delete('/:id', validateId('id'), incomeController.deleteIncome);

module.exports = router;
