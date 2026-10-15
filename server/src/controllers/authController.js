const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const summaryService = require('../services/summaryService');
const Income = require('../models/Income');
const Expense = require('../models/Expense');

/**
 * Generate dynamic greeting based on current local hour and user's first name
 */
const getGreeting = (fullName = '') => {
  const firstName = fullName.trim().split(' ')[0] || 'Friend';
  const hour = new Date().getHours();
  let timeGreeting = 'Good Morning';
  if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good Afternoon';
  } else if (hour >= 17) {
    timeGreeting = 'Good Evening';
  }
  return `${timeGreeting}, ${firstName}! 👋`;
};

/**
 * User Registration
 */
const register = async (req, res, next) => {
  try {
    const { name, fullName, email, password } = req.body || {};
    const finalName = (name || fullName || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();

    const errors = {};
    if (!finalName || finalName.length < 2) {
      errors.name = 'Please provide your full name (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!password || String(password).length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        errors,
        message: Object.values(errors)[0]
      });
    }

    // Check duplicate email
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Conflict',
        message: 'An account with this email address already exists. Please log in instead.'
      });
    }

    const user = new User({
      name: finalName,
      displayName: finalName.split(' ')[0],
      email: cleanEmail,
      password: String(password)
    });

    await user.save();

    const token = generateToken(user);
    const userJson = user.toJSON();

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Finora.',
      token,
      user: userJson,
      greeting: getGreeting(user.name)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * User Login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !password) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Please provide both email and password.'
      });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid email or password. Please verify your credentials and try again.'
      });
    }

    const isMatch = await user.comparePassword(String(password));
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid email or password. Please verify your credentials and try again.'
      });
    }

    const token = generateToken(user);
    const userJson = user.toJSON();

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: userJson,
      greeting: getGreeting(user.name)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Authenticated User Profile
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User account not found.'
      });
    }

    const userJson = user.toJSON();
    res.status(200).json({
      success: true,
      user: userJson,
      data: userJson,
      greeting: getGreeting(user.name)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update Authenticated User Profile
 */
const updateMe = async (req, res, next) => {
  try {
    const {
      name,
      fullName,
      displayName,
      phone,
      phoneNumber,
      phoneCountry,
      dob,
      country,
      language,
      jobTitle,
      bio,
      about,
      avatar,
      photoUrl
    } = req.body || {};

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User account not found.'
      });
    }

    const newName = (name !== undefined ? name : fullName);
    if (newName !== undefined) {
      const cleanName = String(newName).trim();
      if (cleanName.length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Name must be at least 2 characters long.'
        });
      }
      user.name = cleanName;
    }

    if (displayName !== undefined) user.displayName = String(displayName).trim();
    if (phone !== undefined) user.phone = String(phone).trim();
    if (phoneNumber !== undefined) user.phone = String(phoneNumber).trim();
    if (phoneCountry !== undefined) user.phoneCountry = String(phoneCountry).trim();
    if (dob !== undefined) user.dob = String(dob).trim();
    if (country !== undefined) user.country = String(country).trim();
    if (language !== undefined) user.language = String(language).trim();
    if (jobTitle !== undefined) user.jobTitle = String(jobTitle).trim();
    if (bio !== undefined) user.bio = String(bio).trim();
    if (about !== undefined) user.bio = String(about).trim();
    if (avatar !== undefined) user.avatar = avatar;
    if (photoUrl !== undefined) user.avatar = photoUrl;

    await user.save();

    const userJson = user.toJSON();
    res.status(200).json({
      success: true,
      message: 'Profile information updated successfully.',
      user: userJson,
      data: userJson,
      greeting: getGreeting(user.name)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Change Password
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Please provide both your current password and new password.'
      });
    }

    if (String(newPassword).length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'New password must be at least 8 characters long.'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User account not found.'
      });
    }

    const isMatch = await user.comparePassword(String(currentPassword));
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Current password does not match. Please verify and try again.'
      });
    }

    user.password = String(newPassword);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Settings
 */
const getSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User account not found.'
      });
    }

    res.status(200).json({
      success: true,
      settings: user.settings || {},
      data: user.settings || {}
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update Settings
 */
const updateSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User account not found.'
      });
    }

    user.settings = {
      ...(user.settings || {}),
      ...(req.body || {})
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account preferences updated successfully.',
      settings: user.settings,
      data: user.settings
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Unified Authenticated Dashboard Data
 */
const getDashboardData = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User account not found.'
      });
    }

    const now = new Date();
    const year = parseInt(req.query.year, 10) || now.getFullYear();
    const month = parseInt(req.query.month, 10) || (now.getMonth() + 1);

    const [monthlySummary, yearlySummary, recentIncomes, recentExpenses] = await Promise.all([
      summaryService.getMonthlySummary(year, month, req.user.id),
      summaryService.getYearlySummary(year, req.user.id),
      Income.find({ userId: req.user.id }).sort({ date: -1 }).limit(6).lean(),
      Expense.find({ userId: req.user.id }).sort({ date: -1 }).limit(6).lean()
    ]);

    // Interleave recent transactions sorted by date descending
    const allRecent = [...recentIncomes, ...recentExpenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6)
      .map(item => ({
        id: item._id ? item._id.toString() : item.id,
        _id: item._id ? item._id.toString() : item.id,
        title: item.title,
        amount: item.amount,
        type: item.type || (item.category === 'Salary' ? 'income' : 'expense'),
        category: item.category,
        date: item.date,
        account: item.account || item.paidFrom || 'Primary Account',
        status: item.status || 'Completed'
      }));

    const userJson = user.toJSON();

    res.status(200).json({
      success: true,
      user: userJson,
      greeting: getGreeting(user.name),
      summary: monthlySummary,
      monthlySummary,
      yearlySummary,
      recentTransactions: allRecent
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateMe,
  changePassword,
  getSettings,
  updateSettings,
  getDashboardData,
  getGreeting
};
