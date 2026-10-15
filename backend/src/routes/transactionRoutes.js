const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { validateId } = require('../middleware/validateRequest');
const { requireAuth } = require('../middleware/auth');

// Require authentication for all transaction endpoints
router.use(requireAuth);

router.get('/', transactionController.getTransactions);
router.post('/bulk-delete', transactionController.deleteBulkTransactions);
router.get('/:id', validateId('id'), transactionController.getTransactionById);
router.delete('/:id', validateId('id'), transactionController.deleteTransaction);

module.exports = router;
