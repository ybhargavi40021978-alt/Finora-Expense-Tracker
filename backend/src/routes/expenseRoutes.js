const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { validateId, validateExpensePayload } = require('../middleware/validateRequest');
const { requireAuth } = require('../middleware/auth');

// Require authentication for all expense endpoints
router.use(requireAuth);

router.post('/', validateExpensePayload, expenseController.createExpense);
router.get('/', expenseController.getExpenseList);
router.get('/:id', validateId('id'), expenseController.getExpenseById);
router.patch('/:id', validateId('id'), validateExpensePayload, expenseController.updateExpense);
router.put('/:id', validateId('id'), validateExpensePayload, expenseController.updateExpense);
router.delete('/:id', validateId('id'), expenseController.deleteExpense);

module.exports = router;
