const mongoose = require('mongoose');
const Income = require('../models/Income');
const Expense = require('../models/Expense');

/**
 * Helper to construct month date range [startOfMonth, endOfMonth)
 */
const getMonthDateRange = (year, month) => {
  const y = parseInt(year, 10);
  const m = parseInt(month, 10) - 1; // 0-indexed in JS Date
  const start = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(y, m + 1, 1, 0, 0, 0, 0));
  return { start, end };
};

/**
 * Helper to construct year date range [startOfYear, endOfYear)
 */
const getYearDateRange = (year) => {
  const y = parseInt(year, 10);
  const start = new Date(Date.UTC(y, 0, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(y + 1, 0, 1, 0, 0, 0, 0));
  return { start, end };
};

/**
 * Aggregates monthly summary using MongoDB Aggregation Pipelines
 * Scoped strictly to authenticated user's records
 */
const getMonthlySummary = async (year, month, userId = null) => {
  const { start, end } = getMonthDateRange(year, month);

  const matchIncome = { date: { $gte: start, $lt: end } };
  const matchExpense = { date: { $gte: start, $lt: end } };

  if (userId) {
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;
    matchIncome.userId = userObjectId;
    matchExpense.userId = userObjectId;
  }

  // Run income and expense aggregation pipelines in parallel
  const [incomeResult, expenseResult] = await Promise.all([
    Income.aggregate([
      { $match: matchIncome },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]),
    Expense.aggregate([
      { $match: matchExpense },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } }
    ])
  ]);

  let totalIncome = 0;
  let incomeCount = 0;
  incomeResult.forEach(item => {
    totalIncome += item.totalAmount;
    incomeCount += item.count;
  });

  let totalExpenses = 0;
  let expenseCount = 0;
  expenseResult.forEach(item => {
    totalExpenses += item.totalAmount;
    expenseCount += item.count;
  });

  totalIncome = Math.round(totalIncome * 100) / 100;
  totalExpenses = Math.round(totalExpenses * 100) / 100;
  const netBalance = Math.round((totalIncome - totalExpenses) * 100) / 100;

  // Format category breakdowns with percentages
  const incomeByCategory = incomeResult.map(item => ({
    category: item._id || 'Uncategorized',
    amount: Math.round(item.totalAmount * 100) / 100,
    count: item.count,
    percentage: totalIncome > 0 ? Math.round((item.totalAmount / totalIncome) * 1000) / 10 : 0
  }));

  const expenseByCategory = expenseResult.map(item => ({
    category: item._id || 'Uncategorized',
    amount: Math.round(item.totalAmount * 100) / 100,
    count: item.count,
    percentage: totalExpenses > 0 ? Math.round((item.totalAmount / totalExpenses) * 1000) / 10 : 0
  }));

  return {
    year: parseInt(year, 10),
    month: parseInt(month, 10),
    totalIncome,
    totalExpenses,
    netBalance,
    savings: Math.max(0, netBalance),
    incomeCount,
    expenseCount,
    totalTransactions: incomeCount + expenseCount,
    incomeByCategory,
    expenseByCategory
  };
};

/**
 * Aggregates yearly summary using MongoDB Aggregation Pipelines
 * Scoped strictly to authenticated user's records
 */
const getYearlySummary = async (year, userId = null) => {
  const { start, end } = getYearDateRange(year);

  const matchIncome = { date: { $gte: start, $lt: end } };
  const matchExpense = { date: { $gte: start, $lt: end } };

  if (userId) {
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;
    matchIncome.userId = userObjectId;
    matchExpense.userId = userObjectId;
  }

  const [monthlyIncomeAgg, monthlyExpenseAgg, incomeCategoryAgg, expenseCategoryAgg] = await Promise.all([
    // Monthly income totals (months 1-12)
    Income.aggregate([
      { $match: matchIncome },
      {
        $group: {
          _id: { $month: '$date' },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    // Monthly expense totals (months 1-12)
    Expense.aggregate([
      { $match: matchExpense },
      {
        $group: {
          _id: { $month: '$date' },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    // Category breakdowns for the year
    Income.aggregate([
      { $match: matchIncome },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]),
    Expense.aggregate([
      { $match: matchExpense },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } }
    ])
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Map monthly data into continuous 12-month array
  const monthlyData = [];
  let totalIncome = 0;
  let totalExpenses = 0;

  for (let m = 1; m <= 12; m++) {
    const incItem = monthlyIncomeAgg.find(item => item._id === m);
    const expItem = monthlyExpenseAgg.find(item => item._id === m);
    
    const incAmt = incItem ? Math.round(incItem.totalAmount * 100) / 100 : 0;
    const expAmt = expItem ? Math.round(expItem.totalAmount * 100) / 100 : 0;
    
    totalIncome += incAmt;
    totalExpenses += expAmt;

    monthlyData.push({
      monthNumber: m,
      monthName: monthNames[m - 1],
      income: incAmt,
      expenses: expAmt,
      net: Math.round((incAmt - expAmt) * 100) / 100
    });
  }

  totalIncome = Math.round(totalIncome * 100) / 100;
  totalExpenses = Math.round(totalExpenses * 100) / 100;
  const netBalance = Math.round((totalIncome - totalExpenses) * 100) / 100;

  const incomeByCategory = incomeCategoryAgg.map(item => ({
    category: item._id || 'Uncategorized',
    amount: Math.round(item.totalAmount * 100) / 100,
    count: item.count,
    percentage: totalIncome > 0 ? Math.round((item.totalAmount / totalIncome) * 1000) / 10 : 0
  }));

  const expenseByCategory = expenseCategoryAgg.map(item => ({
    category: item._id || 'Uncategorized',
    amount: Math.round(item.totalAmount * 100) / 100,
    count: item.count,
    percentage: totalExpenses > 0 ? Math.round((item.totalAmount / totalExpenses) * 1000) / 10 : 0
  }));

  return {
    year: parseInt(year, 10),
    totalIncome,
    totalExpenses,
    netBalance,
    savings: Math.max(0, netBalance),
    monthlyBreakdown: monthlyData,
    incomeByCategory,
    expenseByCategory
  };
};

/**
 * Lifetime summary of all records for the user
 */
const getOverallSummary = async (userId = null) => {
  const match = {};
  if (userId) {
    match.userId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;
  }

  const [incomeTotal, expenseTotal, incomeCount, expenseCount] = await Promise.all([
    Income.aggregate([
      ...(userId ? [{ $match: match }] : []),
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Expense.aggregate([
      ...(userId ? [{ $match: match }] : []),
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Income.countDocuments(match),
    Expense.countDocuments(match)
  ]);

  const totalIncome = incomeTotal[0] ? Math.round(incomeTotal[0].total * 100) / 100 : 0;
  const totalExpenses = expenseTotal[0] ? Math.round(expenseTotal[0].total * 100) / 100 : 0;
  const netBalance = Math.round((totalIncome - totalExpenses) * 100) / 100;

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    savings: Math.max(0, netBalance),
    incomeCount,
    expenseCount,
    totalTransactions: incomeCount + expenseCount
  };
};

module.exports = {
  getMonthlySummary,
  getYearlySummary,
  getOverallSummary
};
