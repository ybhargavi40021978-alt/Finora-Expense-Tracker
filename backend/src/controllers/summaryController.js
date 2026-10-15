const summaryService = require('../services/summaryService');

// Monthly financial summary
const getMonthly = async (req, res, next) => {
  try {
    const now = new Date();
    const year = parseInt(req.query.year, 10) || now.getFullYear();
    const month = parseInt(req.query.month, 10) || (now.getMonth() + 1);

    if (month < 1 || month > 12) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Month must be an integer between 1 and 12.'
      });
    }

    if (year < 1970 || year > 2100) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Year must be a valid 4-digit year.'
      });
    }

    const userId = req.user ? req.user.id : null;
    const summary = await summaryService.getMonthlySummary(year, month, userId);

    res.status(200).json({
      success: true,
      data: summary,
      summary: summary
    });
  } catch (err) {
    next(err);
  }
};

// Yearly financial summary
const getYearly = async (req, res, next) => {
  try {
    const now = new Date();
    const year = parseInt(req.query.year, 10) || now.getFullYear();

    if (year < 1970 || year > 2100) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Year must be a valid 4-digit year.'
      });
    }

    const userId = req.user ? req.user.id : null;
    const summary = await summaryService.getYearlySummary(year, userId);

    res.status(200).json({
      success: true,
      data: summary,
      summary: summary
    });
  } catch (err) {
    next(err);
  }
};

// Overall / Lifetime summary
const getOverall = async (req, res, next) => {
  try {
    const summary = await summaryService.getOverallSummary();
    res.status(200).json({
      success: true,
      data: summary,
      summary: summary
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMonthly,
  getYearly,
  getOverall
};
