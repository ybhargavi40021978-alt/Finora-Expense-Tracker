const { connectDB, isConnected, mongoose } = require('./connection');
const User = require('./models/User');
const Income = require('./models/Income');
const Expense = require('./models/Expense');

module.exports = {
  connectDB,
  isConnected,
  mongoose,
  User,
  Income,
  Expense
};
