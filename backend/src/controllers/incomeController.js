const Income = require('../models/Income');
const mongoose = require('mongoose');

// Create a new income record
const createIncome = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required. Please sign in to create income records.'
      });
    }

    const {
      title,
      amount,
      category,
      source,
      date,
      dateReceived,
      paymentMethod,
      account,
      description,
      tags,
      isRecurring,
      recurrence,
      includeInReports,
      status
    } = req.body;

    const finalDate = date || dateReceived || new Date();

    const income = new Income({
      userId,
      title,
      amount,
      category: category || source || 'Salary',
      source: source || category || 'Salary',
      date: new Date(finalDate),
      paymentMethod: paymentMethod || 'Bank Transfer',
      account: account || 'Primary Bank Account',
      description: description || '',
      tags: Array.isArray(tags) ? tags : [],
      isRecurring: Boolean(isRecurring),
      recurrence: isRecurring && recurrence ? recurrence : undefined,
      includeInReports: includeInReports !== undefined ? Boolean(includeInReports) : true,
      status: status || 'Completed'
    });

    const saved = await income.save();

    res.status(201).json({
      success: true,
      data: saved,
      record: saved,
      message: `Income of ₹${saved.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} for "${saved.title}" saved successfully.`
    });
  } catch (err) {
    next(err);
  }
};

// Retrieve income records with filtering, searching, and pagination
const getIncomeList = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required. Please sign in to view income records.'
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
        { description: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [records, total] = await Promise.all([
      Income.find(filter).sort(sort).skip(skip).limit(limitNum),
      Income.countDocuments(filter)
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

// Retrieve single income record
const getIncomeById = async (req, res, next) => {
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
        message: 'Invalid income ID format.'
      });
    }

    const income = await Income.findOne({ _id: req.params.id, userId });
    if (!income) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Income record with ID "${req.params.id}" not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: income
    });
  } catch (err) {
    next(err);
  }
};

// Update existing income record
const updateIncome = async (req, res, next) => {
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
        message: 'Invalid income ID format.'
      });
    }

    const allowedUpdates = [
      'title',
      'amount',
      'category',
      'source',
      'date',
      'paymentMethod',
      'account',
      'description',
      'tags',
      'isRecurring',
      'recurrence',
      'includeInReports',
      'status'
    ];

    const updates = {};
    for (const key of Object.keys(req.body)) {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    }

    if (updates.source && !updates.category) updates.category = updates.source;
    if (updates.category && !updates.source) updates.source = updates.category;

    const updated = await Income.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: updates },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Income record with ID "${req.params.id}" not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: updated,
      record: updated,
      message: `Income "${updated.title}" updated successfully.`
    });
  } catch (err) {
    next(err);
  }
};

// Delete income record
const deleteIncome = async (req, res, next) => {
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
        message: 'Invalid income ID format.'
      });
    }

    const deleted = await Income.findOneAndDelete({ _id: req.params.id, userId });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Income record with ID "${req.params.id}" not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: { id: deleted._id.toString() },
      message: `Income "${deleted.title}" deleted successfully.`
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createIncome,
  getIncomeList,
  getIncomeById,
  updateIncome,
  deleteIncome
};
