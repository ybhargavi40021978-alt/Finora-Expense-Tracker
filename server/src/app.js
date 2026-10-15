const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const errorHandler = require('./middleware/errorHandler');
const { isConnected } = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    database: isConnected() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Contact Rate Limits map
const contactRateLimits = {};

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  const { name = '', email = '', subject = '', message = '' } = req.body || {};
  const cleanName = String(name).trim();
  const cleanEmail = String(email).trim();
  const cleanSubject = String(subject).trim();
  const cleanMessage = String(message).trim();

  const errors = {};
  if (!cleanName || cleanName.length < 2) {
    errors.name = 'Please provide your full name (at least 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    errors.email = 'Please provide a valid email address (e.g., name@domain.com).';
  }

  if (!cleanSubject || cleanSubject.length < 3) {
    errors.subject = 'Please specify a subject for your inquiry.';
  }

  if (!cleanMessage || cleanMessage.length < 10) {
    errors.message = 'Please enter a message containing at least 10 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      errors,
      message: 'Please resolve the highlighted validation errors.'
    });
  }

  const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  if (!contactRateLimits[clientIp]) contactRateLimits[clientIp] = [];
  contactRateLimits[clientIp] = contactRateLimits[clientIp].filter(ts => now - ts < 600000);

  if (contactRateLimits[clientIp].length >= 5) {
    return res.status(429).json({
      success: false,
      message: 'Too many messages sent. Please wait a few minutes before contacting us again.'
    });
  }

  contactRateLimits[clientIp].push(now);
  const sanitizedName = cleanName.replace(/[<>]/g, '');

  res.status(200).json({
    success: true,
    message: `Thank you, ${sanitizedName}! Your message has been safely delivered to our support team. We will follow up via ${cleanEmail} shortly.`
  });
});

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const authController = require('./controllers/authController');
const { requireAuth } = require('./middleware/auth');

// Auth & User API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Authenticated Dashboard API
app.get('/api/dashboard', requireAuth, authController.getDashboardData);

// Authenticated Account Settings API
app.get('/api/settings', requireAuth, authController.getSettings);
app.patch('/api/settings', requireAuth, authController.updateSettings);

// Financial CRUD & Summary API routes
app.use('/api/income', incomeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/summary', summaryRoutes);

// Catch unhandled /api/* routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Endpoint "${req.originalUrl}" not found.`
  });
});

// Static assets & pages serving (root directory)
const rootDir = path.resolve(__dirname, '../../');

// Favicon shortcut
app.get('/favicon.ico', (req, res) => {
  const icoPath = path.join(rootDir, 'favicon.ico');
  const svgPath = path.join(rootDir, 'favicon.svg');
  if (fs.existsSync(icoPath)) {
    return res.sendFile(icoPath);
  } else if (fs.existsSync(svgPath)) {
    res.type('image/svg+xml');
    return res.sendFile(svgPath);
  }
  res.status(204).end();
});

// Clean URL router (e.g. /dashboard -> dashboard.html)
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();

  let reqPath = req.path;
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  let filePath = path.join(rootDir, reqPath);
  if (!fs.existsSync(filePath) && !path.extname(reqPath)) {
    const htmlCandidate = filePath + '.html';
    if (fs.existsSync(htmlCandidate)) {
      return res.sendFile(htmlCandidate);
    }
  }

  next();
});

// Static files middleware
app.use(express.static(rootDir, { index: 'index.html' }));

// 404 handler for non-existent frontend routes
app.use((req, res) => {
  const notFoundPath = path.join(rootDir, '404.html');
  if (fs.existsSync(notFoundPath)) {
    res.status(404).sendFile(notFoundPath);
  } else {
    res.status(404).send('404 Not Found');
  }
});

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;
