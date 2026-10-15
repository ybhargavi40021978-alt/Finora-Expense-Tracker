# Finora Database Architecture

This directory contains the database connection logic, Mongoose ODM schemas, and data models for the **Finora Personal Expense Tracker**.

## 📁 Directory Structure
```
database/
├── index.js          # Unified exports for connection and models
├── connection.js     # MongoDB connection setup with auto-reconnection
├── models/
│   ├── User.js       # User account schema, password hashing & preferences
│   ├── Income.js     # Income records schema with user association
│   └── Expense.js    # Expense records schema with user association
└── README.md         # Database documentation
```

## 🗄️ Schemas & Models

### 1. User Model (`models/User.js`)
- Stores user credentials and account settings.
- Passwords are encrypted using `bcryptjs`.
- Fields: `name`, `email` (unique index), `password`, `avatar`, `settings` (`currency`, `dateFormat`, `monthlyBudgetAlert`), `createdAt`.

### 2. Income Model (`models/Income.js`)
- Records all incoming funds for a specific user.
- Fields: `userId` (indexed reference to User), `title`, `amount` (min: 0.01), `category`, `date`, `paymentMethod`, `notes`.

### 3. Expense Model (`models/Expense.js`)
- Records all expenditures for a specific user.
- Fields: `userId` (indexed reference to User), `title`, `amount` (min: 0.01), `category`, `date`, `paymentMethod`, `notes`.

## 🔒 Multi-Tenant Data Isolation
Every data operation strictly filters by `userId: req.userId` to ensure complete privacy and zero data leakage across different user accounts.
