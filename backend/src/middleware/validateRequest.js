const mongoose = require('mongoose');

// Sanitize string inputs to prevent XSS
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, '').trim();
};

const validateId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: `Invalid ID format: "${id}". Must be a valid 24-character hexadecimal ObjectId.`
      });
    }
    next();
  };
};

const validateIncomePayload = (req, res, next) => {
  const { title, amount, category, source, date, dateReceived } = req.body;
  const errors = {};

  const cleanTitle = sanitizeString(title);
  if (!cleanTitle || cleanTitle.length < 2) {
    errors.title = 'Title is required and must be at least 2 characters long.';
  } else if (cleanTitle.length > 120) {
    errors.title = 'Title cannot exceed 120 characters.';
  }

  const numAmount = Number(amount);
  if (amount === undefined || amount === null || isNaN(numAmount) || !Number.isFinite(numAmount) || numAmount <= 0) {
    errors.amount = 'Amount must be a valid number greater than ₹0.';
  }

  const chosenDate = date || dateReceived;
  if (chosenDate && isNaN(new Date(chosenDate).getTime())) {
    errors.date = 'Invalid date format provided.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      errors,
      message: 'Please resolve the highlighted validation errors.'
    });
  }

  // Attach sanitized fields
  req.body.title = cleanTitle;
  req.body.amount = Math.round(numAmount * 100) / 100; // 2 decimal places precision
  if (category) req.body.category = sanitizeString(category);
  if (source) req.body.source = sanitizeString(source);
  if (req.body.description) req.body.description = sanitizeString(req.body.description);

  next();
};

const validateExpensePayload = (req, res, next) => {
  const { title, amount, category, date, expenseDate } = req.body;
  const errors = {};

  const cleanTitle = sanitizeString(title);
  if (!cleanTitle || cleanTitle.length < 2) {
    errors.title = 'Title is required and must be at least 2 characters long.';
  } else if (cleanTitle.length > 120) {
    errors.title = 'Title cannot exceed 120 characters.';
  }

  const numAmount = Number(amount);
  if (amount === undefined || amount === null || isNaN(numAmount) || !Number.isFinite(numAmount) || numAmount <= 0) {
    errors.amount = 'Amount must be a valid number greater than ₹0.';
  }

  const cleanCategory = sanitizeString(category);
  if (!cleanCategory) {
    errors.category = 'Category is required.';
  }

  const chosenDate = date || expenseDate;
  if (chosenDate && isNaN(new Date(chosenDate).getTime())) {
    errors.date = 'Invalid date format provided.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      errors,
      message: 'Please resolve the highlighted validation errors.'
    });
  }

  // Attach sanitized fields
  req.body.title = cleanTitle;
  req.body.amount = Math.round(numAmount * 100) / 100;
  req.body.category = cleanCategory;
  if (req.body.merchant) req.body.merchant = sanitizeString(req.body.merchant);
  if (req.body.description) req.body.description = sanitizeString(req.body.description);

  next();
};

module.exports = {
  validateId,
  validateIncomePayload,
  validateExpensePayload,
  sanitizeString
};
