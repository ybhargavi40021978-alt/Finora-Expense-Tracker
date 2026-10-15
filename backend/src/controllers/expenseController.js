const Expense = require('../models/Expense');
const mongoose = require('mongoose');

// Create a new expense record
const createExpense = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required. Please sign in to create expense records.'
      });
    }

    const {
      title,
      amount,
      category,
      date,
      expenseDate,
      paymentMethod,
      paidFrom,
      account,
      merchant,
      description,
      tags,
      hasReceipt,
      receiptFileName,
      isRecurring,
      recurrence,
      includeInReports,
      isEssential,
      status
    } = req.body;

    const finalDate = date || expenseDate || new Date();

    const expense = new Expense({
      userId,
      title,
      amount,
      category: category || 'Food & Dining',
      date: new Date(finalDate),
      paymentMethod: paymentMethod || 'UPI',
      paidFrom: paidFrom || account || 'Primary Bank Account',
      account: account || paidFrom || 'Primary Bank Account',
      merchant: merchant || '',
      description: description || '',
      tags: Array.isArray(tags) ? tags : [],
      hasReceipt: Boolean(hasReceipt || receiptFileName),
      receiptFileName: receiptFileName || null,
      isRecurring: Boolean(isRecurring),
      recurrence: isRecurring && recurrence ? recurrence : undefined,
      includeInReports: includeInReports !== undefined ? Boolean(includeInReports) : true,
      isEssential: Boolean(isEssential),
      status: status || 'Completed'
    });

    const saved = await expense.save();

    res.status(201).json({
      success: true,
      data: saved,
      record: saved,
      message: `Expense of ₹${saved.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} for "${saved.title}" saved successfully.`
    });
  } catch (err) {
    next(err);
  }
};

// Retrieve expense records with filtering, searching, and pagination
const getExpenseList = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required. Please sign in to view expense records.'
      });
    }

    const {
      category,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 50,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

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
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { merchant: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [records, total] = await Promise.all([
      Expense.find(filter).sort(sort).skip(skip).limit(limitNum),
      Expense.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: records,
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

// Retrieve single expense record
const getExpenseById = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required.'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid expense ID format.'
      });
    }

    const expense = await Expense.findOne({ _id: req.params.id, userId });
    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Expense record with ID "${req.params.id}" not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (err) {
    next(err);
  }
};

// Update existing expense record
const updateExpense = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required.'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid expense ID format.'
      });
    }

    const allowedUpdates = [
      'title',
      'amount',
      'category',
      'date',
      'paymentMethod',
      'paidFrom',
      'account',
      'merchant',
      'description',
      'tags',
      'hasReceipt',
      'receiptFileName',
      'isRecurring',
      'recurrence',
      'includeInReports',
      'isEssential',
      'status'
    ];

    const updates = {};
    for (const key of Object.keys(req.body)) {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    }

    if (updates.paidFrom && !updates.account) updates.account = updates.paidFrom;
    if (updates.account && !updates.paidFrom) updates.paidFrom = updates.account;

    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: updates },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Expense record with ID "${req.params.id}" not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: updated,
      record: updated,
      message: `Expense "${updated.title}" updated successfully.`
    });
  } catch (err) {
    next(err);
  }
};

// Delete expense record
const deleteExpense = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required.'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid expense ID format.'
      });
    }

    const deleted = await Expense.findOneAndDelete({ _id: req.params.id, userId });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Expense record with ID "${req.params.id}" not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: { id: deleted._id.toString() },
      message: `Expense "${deleted.title}" deleted successfully.`
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createExpense,
  getExpenseList,
  getExpenseById,
  updateExpense,
  deleteExpense
};
