const Income = require('../models/Income');
const Expense = require('../models/Expense');
const mongoose = require('mongoose');

// Unified transaction retrieval across both Income and Expense collections for authenticated user
const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required. Please sign in to view transactions.'
      });
    }

    const {
      type = 'all', // 'all', 'income', 'expense'
      category,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 50,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    const buildFilter = (isIncome = false) => {
      const filter = { userId };

      if (category && category !== 'all' && category !== 'All') {
        filter.category = category;
      }

      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) {
          const eDate = new Date(endDate);
          eDate.setHours(23, 59, 59, 999);
          filter.date.$lte = eDate;
        }
      }

      if (search && search.trim()) {
        const s = search.trim();
        const searchConditions = [
          { title: { $regex: s, $options: 'i' } },
          { description: { $regex: s, $options: 'i' } },
          { category: { $regex: s, $options: 'i' } }
        ];
        if (!isIncome) {
          searchConditions.push({ merchant: { $regex: s, $options: 'i' } });
        }
        filter.$or = searchConditions;
      }

      return filter;
    };

    let items = [];

    if (type === 'income') {
      items = await Income.find(buildFilter(true)).lean();
    } else if (type === 'expense') {
      items = await Expense.find(buildFilter(false)).lean();
    } else {
      const [incomes, expenses] = await Promise.all([
        Income.find(buildFilter(true)).lean(),
        Expense.find(buildFilter(false)).lean()
      ]);
      items = [...incomes, ...expenses];
    }

    // Sort unified list in-memory
    items.sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'amount') {
        return (a.amount - b.amount) * order;
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title) * order;
      } else {
        // default sortBy === 'date'
        return (new Date(a.date).getTime() - new Date(b.date).getTime()) * order;
      }
    });

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const total = items.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = items.slice(startIndex, startIndex + limitNum);

    const formattedTransactions = paginatedItems.map(item => ({
      _id: item._id.toString(),
      id: item._id.toString(),
      title: item.title,
      amount: item.amount,
      type: item.type || (item.category === 'Salary' ? 'income' : 'expense'),
      category: item.category,
      date: item.date,
      paymentMethod: item.paymentMethod,
      account: item.account || item.paidFrom || item.depositAccount || 'Primary Account',
      merchant: item.merchant || '',
      source: item.source || '',
      description: item.description || '',
      status: item.status || 'Completed',
      isRecurring: Boolean(item.isRecurring),
      hasReceipt: Boolean(item.hasReceipt),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    res.status(200).json({
      success: true,
      data: formattedTransactions,
      transactions: formattedTransactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (err) {
    next(err);
  }
};

// Retrieve a single transaction by ID for authenticated user
const getTransactionById = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required.'
      });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid transaction ID format.'
      });
    }

    let record = await Income.findOne({ _id: id, userId });
    let type = 'income';

    if (!record) {
      record = await Expense.findOne({ _id: id, userId });
      type = 'expense';
    }

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Transaction with ID "${id}" not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...record.toJSON(),
        type
      }
    });
  } catch (err) {
    next(err);
  }
};

// Delete a single transaction by ID for authenticated user
const deleteTransaction = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required.'
      });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid transaction ID format.'
      });
    }

    let deleted = await Income.findOneAndDelete({ _id: id, userId });
    let type = 'income';

    if (!deleted) {
      deleted = await Expense.findOneAndDelete({ _id: id, userId });
      type = 'expense';
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Transaction with ID "${id}" not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: { id, type },
      message: `Transaction "${deleted.title}" deleted successfully.`
    });
  } catch (err) {
    next(err);
  }
};

// Bulk delete transactions for authenticated user
const deleteBulkTransactions = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required.'
      });
    }

    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Please provide an array of transaction IDs to delete.'
      });
    }

    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    if (validIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'No valid MongoDB ObjectIds provided.'
      });
    }

    const [incomeRes, expenseRes] = await Promise.all([
      Income.deleteMany({ _id: { $in: validIds }, userId }),
      Expense.deleteMany({ _id: { $in: validIds }, userId })
    ]);

    const deletedCount = (incomeRes.deletedCount || 0) + (expenseRes.deletedCount || 0);

    res.status(200).json({
      success: true,
      data: { deletedCount },
      message: `Successfully deleted ${deletedCount} transaction(s).`
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  deleteTransaction,
  deleteBulkTransactions
};
